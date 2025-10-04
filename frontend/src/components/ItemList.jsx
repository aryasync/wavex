import ItemCard from './ItemCard';

const ItemList = ({ items, onDeleteItem }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <ItemCard 
          key={item.id || index} 
          item={item} 
          onDelete={onDeleteItem}
        />
      ))}
    </div>
  );
};

export default ItemList;
