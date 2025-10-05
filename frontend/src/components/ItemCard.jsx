const ItemCard = ({ item, onDelete }) => {
  return (
    <div className="bg-white p-6 mb-4 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
          <p className="text-sm text-gray-600 mt-1">Expires: {item.expiryDate}</p>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(item.id)}
            className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
