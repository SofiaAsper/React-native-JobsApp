import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const useFetch = (endpoint, query) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const cache = useRef({});

    const options = {
        method: 'GET',
        url: `https://jsearch.p.rapidapi.com/${endpoint}`,
        params: { ...query },
        headers: {
            'X-RapidAPI-Key': 'a973d847cdmsh4cac9ff2c74a8b0p11cd21jsn09774579a62e',
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
    };

    const fetchData = async () => {
        setIsLoading(true);
        const cacheKey = JSON.stringify(options);
        if (cache.current[cacheKey]) {
            setData(cache.current[cacheKey]);
            setIsLoading(false);
        } else {
            try {
                const response = await axios.request(options);
                setData(response.data.data);
                cache.current[cacheKey] = response.data.data;
                setIsLoading(false);
            } catch (error) {
                setError(error);
                alert('There was an error fetching data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const refetch = () => {
        fetchData();
    };

    return { data, isLoading, error, refetch };
};

export default useFetch;
