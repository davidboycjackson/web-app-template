import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import type { ItemType } from '../../../styles/styles';

interface ListItemProps {
    item: ItemType;
    setItemList: React.Dispatch<React.SetStateAction<ItemType[]>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

const ListItem = ({ item, setItemList, setIsLoading, setErrorMessage }: ListItemProps) => {
    async function deleteItem() {
        console.log(`Deleting item with id: ${item.id}`);

        setIsLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/list/delete/${item.id}`,
                {
                    method: 'DELETE',
                },
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const message =
                    typeof errorData?.detail === 'string' && errorData.detail.length > 0
                        ? errorData.detail
                        : 'Unable to delete item.';

                setErrorMessage(message);
                return;
            }

            setItemList((currentList) => currentList.filter((listItem) => listItem.id !== item.id));
        } catch (error) {
            console.log(error);
            setErrorMessage('Unable to connect to the API.');
        } finally {
            setIsLoading(false);
        }
    }
    
    return (
        <div className="list-item-container">
            <div className="flex-2">
                <h3>{item.item}</h3>
            </div>

            <div className="flex-1">
                <p>{new Date(item.time_added).toLocaleString()}</p>
            </div>

            <div className="flex-1 flex justify-end">
                <button className="danger-button px-3 py-2" onClick={deleteItem}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                </button>
            </div>
        </div>
    );
};

export default ListItem;
