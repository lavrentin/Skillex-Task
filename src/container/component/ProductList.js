import React, { useState } from 'react';
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';

const Containerr = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 70%;
    margin: 20px auto;
    font-family: sans-serif;
    font-size: 1.2em;
`;

const Box = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
`;

const Pages = styled.div`
    margin-top: 20px;

    .pagination {
        display: flex;
        list-style: none;
        padding: 0;
        align-items: center;
        cursor: pointer;
    }

    .pagination__link {
        padding: 5px;
        margin: 0 5px;
        border: 1px solid #5e5bff;
        border-radius: 4px;
        cursor: pointer;
    }

    .pagination__link--disabled {
        color: #ccc;
        cursor: not-allowed;
    }

    .pagination__link--active {
        background-color: #5e5bff;
        color: #fff;
        border: 1px solid #5e5bff;
        border-radius: 4px;
        padding: 5px;
        cursor: pointer;
    }
`;

const Card = styled.div`
    border-radius: 4px;
    box-shadow: 0 0 10px #5e5bff;
    width: 300px;
    background-color: #fff;
    padding: 10px;
    margin: 10px 30px;

    img {
        width: 100%;
        height: 200px;
        object-fit: contain;
        border: 1px solid #ccc;
    }

    h4 {
        margin: 10px 0;
    }

    p {
        margin: 5px 0;

        &:last-child {
            font-size: 1.2em;
        }
    }
`;

const ProductList = ({ filteredProducts }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 4;

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const offset = currentPage * itemsPerPage;
    const currentProducts = filteredProducts.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

    return (
        <Containerr data-testid="product-List-container">
            <Box>
                {currentProducts.map(product => (
                    <Card key={product.id} className="product-item">
                        <img src={product.imageUrl} alt={product.name}/>
                        <h4>{product.name}</h4>
                        <p>{product.category}</p>
                        <p>{product.brand}</p>
                        <p>${product.price}</p>
                        <p>Popularity: {product.popularity}</p>
                        <p>Rating: {product.rating}</p>
                    </Card>
                ))}
            </Box>

            <Pages>
                <ReactPaginate
                    previousLabel={"<"}
                    nextLabel={">"}
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    previousLinkClassName={"pagination__link"}
                    nextLinkClassName={"pagination__link"}
                    disabledClassName={"pagination__link--disabled"}
                    activeClassName={"pagination__link--active"}
                />
            </Pages>
        </Containerr>
    );
};

export default ProductList;