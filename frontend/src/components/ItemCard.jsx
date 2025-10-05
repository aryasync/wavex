const ItemCard = ({ item, onDelete }) => {
  return (
    <div className="bg-gray-50 p-4 mb-3 rounded-xl border border-gray-200">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-gray-900">{item.name}</h3>
          <p className="text-sm text-gray-600">Expires: {item.expiryDate}</p>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(item.id)}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
