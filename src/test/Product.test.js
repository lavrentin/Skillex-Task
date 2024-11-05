import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Products from '../container';
import Filter from '../container/filter/Filter';
import ProductList from '../container/component/ProductList';

describe('Products Component', () => {
    test('renders Products component', () => {
        render(<Products />);
        expect(screen.getByTestId('productsContainer')).toBeInTheDocument();
    });

    test('renders Filter component', () => {
        render(<Filter setFilteredProducts={() => {}} setLoading={() => {}} setNoProducts={() => {}} />);
        expect(screen.getByTestId('filter-component')).toBeInTheDocument();
    });

    test('renders ProductList component', () => {
        render(<ProductList filteredProducts={[]} />);
        expect(screen.getByTestId('product-List-container')).toBeInTheDocument();
    });

    test('filters products based on category', async () => {
        const setFilteredProducts = jest.fn();
        render(<Filter setFilteredProducts={setFilteredProducts} setLoading={() => {}} setNoProducts={() => {}} />);

        const categoryDropdown = screen.getByLabelText(/category:/i);
        fireEvent.change(categoryDropdown, { target: { value: 'Electronics' } });

        await waitFor(() => {
            expect(setFilteredProducts).toHaveBeenCalled();
        });
    });

    test('displays no products found when no products match the filter criteria', async () => {
        const { getByText } = render(<Products />);

        fireEvent.change(screen.getByLabelText(/category:/i), { target: { value: 'Non-existent Category' } });

        await waitFor(() => {
            expect(getByText(/No products found/i)).toBeInTheDocument();
        });
    });

    test('checks real-time updates on filter changes', async () => {
        render(<Products />);

        const brandDropdown = screen.getByLabelText(/brand:/i);
        fireEvent.change(brandDropdown, { target: { value: 'Brand A' } });

        await waitFor(() => {
            const products = screen.getByTestId('product-List-container').children;
            expect(products.length).toBeGreaterThan(0);
        });
    });

    test('sorts products correctly when sorting functionality is implemented', async () => {
        const setFilteredProducts = jest.fn();
        render(<Filter setFilteredProducts={setFilteredProducts} setLoading={() => {}} setNoProducts={() => {}} />);

        const sortDropdown = screen.getByLabelText(/Sort By:/i);
        fireEvent.change(sortDropdown, { target: { value: 'price' } });

        const sortOrderButton = screen.getByText('↑');
        fireEvent.click(sortOrderButton);

        await waitFor(() => {
            expect(setFilteredProducts).toHaveBeenCalled();
        });
    });
});
