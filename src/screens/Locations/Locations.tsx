import React, { useEffect } from 'react';

import locationsLogo from 'assets/locationsLogo.png';
import { InputsWrapper } from 'components/InputsWrapper';
import { LoadMoreButton } from 'components/LoadMoreButton';
import { LocationsList } from 'components/LocationsList';
import { ScreenImage } from 'components/ScreenImage';
import { ScreenWrapper } from 'components/ScreenWrapper';
import { SearchInput as OSearchInput } from 'components/SearchInput';
import { SelectInput } from 'components/SelectInput';
import { DIMENSIONS, TYPES } from 'constants/locationsOptions';
import { useLocations } from 'hooks/useLocations';
import { useQueryLoadingStatus } from 'hooks/useQueryLoadingStatus';
import { useSearchForm } from 'hooks/useSearchForm';
import styled from 'styled-components';

type SearchParams = {
  name: string;
  type: string;
  dimension: string;
};

const SearchInput = styled(OSearchInput)`
  width: 326px;

  @media (max-width: 640px) {
    width: 240px;
  }
`;

export const Locations = () => {
  const { formState: searchParams, handleChange } = useSearchForm<SearchParams>({
    name: '',
    type: '',
    dimension: '',
  });
  const { data, error, isNextPage, loadMoreLocations, networkStatus, refetch } = useLocations();
  const { isFetchMoreLoading, isInitialOrRefetchLoading } = useQueryLoadingStatus(networkStatus);

  useEffect(() => {
    // TODO: add debounce for name changes
    refetch({ filter: searchParams });
  }, [searchParams, refetch]);

  return (
    <ScreenWrapper>
      <ScreenImage src={locationsLogo} alt="characters" />
      <InputsWrapper>
        <SearchInput placeholder="Filter by name..." onChange={(e) => handleChange(e, 'name')} />
        <SelectInput placeholder="Type" options={TYPES} onChange={(e) => handleChange(e, 'type')} />
        <SelectInput placeholder="Dimension" options={DIMENSIONS} onChange={(e) => handleChange(e, 'dimension')} />
      </InputsWrapper>
      <LocationsList locations={data} loading={isInitialOrRefetchLoading} error={error} />
      {isNextPage && !error && !isInitialOrRefetchLoading && (
        <LoadMoreButton onClick={loadMoreLocations} loading={isFetchMoreLoading} disabled={isFetchMoreLoading} />
      )}
    </ScreenWrapper>
  );
};
