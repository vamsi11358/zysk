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
        <li key={index}>{lis.title}</li>
    ));

    return (
        <>
            <h1>List</h1>
            
            <form onSubmit={formik.handleSubmit}>
                <input
                    placeholder='search'
                    name='searchTerm'
                    onChange={formik.handleChange}
                    value={formik.values.searchTerm}
                />
                <button type='submit'>Search</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? <p>Loading...</p> : <ol>{UI}</ol>}
        </>
    );
}
