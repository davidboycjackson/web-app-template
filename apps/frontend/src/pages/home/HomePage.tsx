import type { ItemType } from '../../styles/styles';
import { useState, useEffect } from 'react';
import ListItem from './components/ListItem';
import './HomePage.css';
import AddItemInput from './components/AddItemInput';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [itemList, setItemList] = useState<ItemType[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchList() {
      setIsLoading(true);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/list`);

        if (!response.ok) {
          throw new Error('Unable to fetch list.');
        }

        const data = (await response.json()) as { list: ItemType[] };
        setItemList(data.list);
      } catch (error) {
        console.log(error);
        setErrorMessage('Unable to load list from the API.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchList();
  }, []);

  return (
    <div className="page-body">
      <h1 data-testid="page-header">Homepage</h1>

      {isLoading && <p>Loading...</p>}

      {errorMessage && <p className="text-red-600">{errorMessage}</p>}

      <AddItemInput
        setItemList={setItemList}
        setIsLoading={setIsLoading}
        setErrorMessage={setErrorMessage}
      />

      <div className="list-container">
        {itemList.map((testItem) => (
          <ListItem
            key={testItem.id}
            item={testItem}
            setItemList={setItemList}
            setIsLoading={setIsLoading}
            setErrorMessage={setErrorMessage}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
