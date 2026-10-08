import { useState } from "react";
import type { ItemType } from "../../../styles/styles";

interface AddItemInputProps {
  setItemList: React.Dispatch<React.SetStateAction<ItemType[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

const AddItemInput = ({ setItemList, setIsLoading, setErrorMessage }: AddItemInputProps) => {
  const [newItem, setNewItem] = useState('');

  async function addNewItem(e: React.FormEvent) {
    e.preventDefault();
    const item = newItem.trim();

    if (item === '') return;

    setIsLoading(true);
    setErrorMessage('');
    setNewItem('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/list/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message =
          typeof errorData?.detail === 'string' && errorData.detail.length > 0
            ? errorData.detail
            : 'Unable to add item.';

        setErrorMessage(message);
        setNewItem(item);
        return;
      }

      const createdItem = (await response.json()) as ItemType;
      setItemList((currentList) => [...currentList, createdItem]);
    } catch (error) {
      console.log(error);
      setErrorMessage('Unable to connect to the API.');
      setNewItem(item);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <form className="w-full flex gap-2 my-2" onSubmit={addNewItem}>
        <input
          type="text"
          placeholder="Add new item"
          className="w-full rounded-full bg-white px-4 py-2"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button className="default-button px-10">Add</button>
      </form>
    </>
  );
};

export default AddItemInput;
