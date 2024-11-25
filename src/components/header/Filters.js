import styled from 'styled-components';
import { API_URL, useData } from '../providers';
import { useEffect, useState } from 'react';

const getAllCharacters = async () => {
  const characters = [];
  let totalPages = 1;

  for (let i = 1; i <= totalPages; i++) {
    const response = await fetch(`${API_URL}?page=${i}`);
    const data = await response.json();
    characters.push(...data.results);

    totalPages = data.info.pages;
  }

  return characters;
};

const getValues = async (value) => {
  const characters = await getAllCharacters();
  const validGenders = ['Male', 'Female', 'Genderless', 'unknown'];
  const values = [];

  characters.forEach((character) => {
    const charValue = character[value];
    if (
      !values.includes(charValue) &&
      charValue &&
      (value !== 'gender' || validGenders.includes(charValue))
    ) {
      values.push(charValue);
    }
  });

  return values;
};

export default function Filters() {
  const { setSearchParams } = useData();

  const [values, setValues] = useState({
    statuses: [],
    species: [],
    types: [],
    genders: []
  });

  const [tempFilters, setTempFilters] = useState({
    name: '',
    status: '',
    specie: '',
    type: '',
    gender: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const statuses = await getValues('status');
      const species = await getValues('species');
      const types = await getValues('type');
      const genders = await getValues('gender');

      setValues({
        statuses,
        species,
        types,
        genders
      });
    };

    fetchData();
  }, []);

  const updateTempFilters = (name, value) => {
    setTempFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const applyFilters = () => {
    setSearchParams((prevParams) => {
      const params = new URLSearchParams(prevParams);

      Object.entries(tempFilters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      params.set('page', '1');

      return params;
    });
  };

  return (
    <Container>
      <div>
        <StyledInput
          name="name"
          type="text"
          placeholder="Name"
          onChange={(e) => updateTempFilters('name', e.target.value)}
        />
      </div>

      <div>
        <StyledSelect
          name="status"
          value={tempFilters.status}
          onChange={(e) => updateTempFilters('status', e.target.value)}
        >
          <option value="">Status</option>
          {values.statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </StyledSelect>
      </div>

      <div>
        <StyledSelect
          name="specie"
          value={tempFilters.specie}
          onChange={(e) => updateTempFilters('specie', e.target.value)}
        >
          <option value="">Specie</option>
          {values.species.map((specie) => (
            <option key={specie} value={specie}>
              {specie}
            </option>
          ))}
        </StyledSelect>
      </div>

      <div>
        <StyledSelect
          name="type"
          value={tempFilters.type}
          onChange={(e) => updateTempFilters('type', e.target.value)}
        >
          <option value="">Type</option>
          {values.types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </StyledSelect>
      </div>

      <div>
        <StyledSelect
          name="gender"
          value={tempFilters.gender}
          onChange={(e) => updateTempFilters('gender', e.target.value)}
        >
          <option value="">Gender</option>
          {values.genders.map((gender) => (
            <option key={gender} value={gender}>
              {gender}
            </option>
          ))}
        </StyledSelect>
      </div>

      <div>
        <StyledButton onClick={applyFilters}>Apply</StyledButton>
      </div>
    </Container>
  );
}

const Container = styled.div`
  padding: 10px 10px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  gap: 12px;
`;

const StyledInput = styled.input`
  padding: 6px;
  max-width: 200px;
  border: none;
  border-radius: 6px;
`;

const StyledSelect = styled.select`
  padding: 6px;
  max-width: 200px;
  border: none;
  border-radius: 6px;
`;

const StyledButton = styled.button`
  padding: 6px 12px;
  max-width: 200px;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #83bf46;
  }
`;
