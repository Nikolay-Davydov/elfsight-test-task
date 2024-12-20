import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { API_URL, useData } from './providers';

export function Pagination() {
  const [pages, setPages] = useState([]);
  const { info, activePage, setSearchParams } = useData();

  const pageClickHandler = (index) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setSearchParams((prevParams) => {
      const updateParams = new URLSearchParams(prevParams);
      updateParams.set('page', index + 1);
      return updateParams;
    });
  };

  useEffect(() => {
    const createPages = Array.from({ length: info.pages }, (_, i) => {
      const URLWithPage = new URL(API_URL);

      URLWithPage.searchParams.set('page', i + 1);

      return URLWithPage;
    });

    setPages(createPages);
  }, [info]);

  if (pages.length <= 1) return null;

  return (
    <StyledPagination>
      <>
        {pages[activePage - 1] && (
          <>
            {activePage - 1 !== 0 && (
              <>
                <Page onClick={() => pageClickHandler(0)}>« First</Page>
                <Ellipsis>...</Ellipsis>
              </>
            )}

            <Page onClick={() => pageClickHandler(activePage - 1)}>
              {activePage}
            </Page>
          </>
        )}

        <Page active>{activePage + 1}</Page>

        {pages[activePage + 1] && (
          <>
            <Page onClick={() => pageClickHandler(activePage + 1)}>
              {activePage + 2}
            </Page>

            {activePage + 1 !== pages.length - 1 && (
              <>
                <Ellipsis>...</Ellipsis>
                <Page onClick={() => pageClickHandler(pages.length - 1)}>
                  Last »
                </Page>
              </>
            )}
          </>
        )}
      </>
    </StyledPagination>
  );
}

const StyledPagination = styled.div`
  width: 100%;
  text-align: center;
`;

const Page = styled.span`
  color: #fff;
  font-size: 18px;
  padding: 5px;
  cursor: pointer;
  transition: color 0.2s;
  ${({ active }) => active && 'color: #83bf46'};

  &:hover {
    color: #83bf46;
  }
`;

// const Container = styled.div`
//   width: 100%;
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
//   justify-items: center;
//   gap: 30px;
// `;

const Ellipsis = styled(Page)`
  cursor: default;

  &:hover {
    color: #fff;
  }
`;
