import { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';

export default function List() {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const dataList = async () => {
        try {
            setLoading(true);
            const responseApi = await axios.get('https://jsonplaceholder.typicode.com/todos');
            setData(responseApi.data);
            setOriginalData(responseApi.data);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    }

    const formik = useFormik({
        initialValues: {
            searchTerm: ''
        },
        onSubmit: values => {
            handleSearch(values.searchTerm);
        }
    });

    const handleSearch = (searchTerm) => {
        if (searchTerm === "") {
            setError('Please enter a search term.');
            setData(originalData);
            return;
        }
        const filterBySearch = originalData.filter((item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setData(filterBySearch);
        setError(filterBySearch.length === 0 ? 'No items match your search.' : '');
    }

    useEffect(() => {
        dataList();
    }, []);

    const UI = data.map((lis, index) => (
        <li key={index} style={{ padding: '8px 0', borderBottom: '1px solid #ccc' }}>{lis.title}</li>
    ));

    return (
        <>
            <h1 >List</h1>

            <form onSubmit={formik.handleSubmit} style={{ marginBottom: '20px' }}>
                <input
                    placeholder='search'
                    name='searchTerm'
                    onChange={formik.handleChange}
                    value={formik.values.searchTerm}
                    style={{ padding: '8px', marginRight: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <button type='submit' style={{ padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Search
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? <p>Loading...</p> : <ol style={{ paddingLeft: '20px' }}>{UI}</ol>}
        </>
    );
}
