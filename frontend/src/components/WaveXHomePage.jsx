import React, { useState, useMemo } from "react";
import { useItems } from "../App";

const WaveXHomePage = () => {
  const { items, loading, error, refetchItems } = useItems();
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryClick = (category) => {
    if (category === 'CLEAR_ALL') {
      setSelectedCategories([]);
      return;
    }
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const filteredItems = useMemo(() => {
    if (selectedCategories.length === 0) {
      return items;
    }
    return items.filter(item => 
      selectedCategories.some(category => 
        item.category.toLowerCase() === category.toLowerCase()
      )
    );
  }, [items, selectedCategories]);

  // Check for items expiring within 3 days
  const expiringSoon = useMemo(() => {
    return items.filter(item => {
      const expiryDate = new Date(item.expiryDate);
      const today = new Date();
      const diffTime = expiryDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && diffDays >= 0;
    });
  }, [items]);

  const hasNotifications = expiringSoon.length > 0;

  const categories = [
    { name: 'Produce', icon: '🍎' },
    { name: 'Dairy', icon: '🧀' },
    { name: 'Meat', icon: '🍖' },
    { name: 'Pantry', icon: '🥫' },
    { name: 'Other', icon: '🍽️' }
  ];

  return (
    <div className="overflow-hidden bg-[linear-gradient(0deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.2)_100%),linear-gradient(180deg,rgba(10,18,20,1)_0%,rgba(0,60,50,1)_50%,rgba(0,38,32,1)_100%)] w-full min-w-[390px] h-[844px] relative">
      
      {/* Bottom Navigation Circles */}
      <div className="absolute top-[784px] left-5 w-[49px] h-12 bg-[#011f1b] rounded-[24.5px/24px]" />
      <div className="absolute top-[781px] left-[113px] w-[52px] h-[54px] bg-[#011f1b] rounded-[26px/27px]" />
      <div className="absolute top-[778px] left-[211px] w-[52px] h-[54px] bg-[#011f1b] rounded-[26px/27px]" />
      <div className="absolute top-[779px] left-[322px] w-[52px] h-[54px] bg-[#011f1b] rounded-[26px/27px]" />

      {/* Wave Icon */}
      <div className="absolute top-[25px] left-[328px] w-9 h-9 aspect-[1] flex items-center justify-center">
        <span className="text-white text-2xl">🌊</span>
      </div>

      {/* HOME Header */}
      <div className="absolute top-[17px] left-[22px] h-[49px] flex items-center justify-center [text-shadow:0px_2.01px_2.01px_#00000040] [-webkit-text-stroke:0.5px_#000000] [font-family:'Kodchasan-Regular',Helvetica] font-normal text-white text-[35.1px] tracking-[4.57px] leading-[49.2px] whitespace-nowrap">
        HOME
      </div>

      {/* Animated HOME Text */}
      <div className="absolute top-[-284px] -left-1 w-[276px] h-[127px] flex">
        <div className="mt-[19.3px] w-12 h-[102px] ml-[17.0px] rotate-[-21.42deg] [font-family:'Kaushan_Script-Regular',Helvetica] font-normal text-white text-[70px] tracking-[0] leading-[normal]">
          H
        </div>
        <div className="mt-[4.2px] w-[51px] h-[102px] ml-[7.7px] rotate-[-8.08deg] [font-family:'Kaushan_Script-Regular',Helvetica] font-normal text-white text-[70px] tracking-[0] leading-[normal]">
          O
        </div>
        <div className="mt-[3.9px] w-[66px] h-[102px] ml-[10.3px] rotate-[7.47deg] [font-family:'Kaushan_Script-Regular',Helvetica] font-normal text-white text-[70px] tracking-[0] leading-[normal]">
          M
        </div>
        <div className="mt-[20.3px] w-[43px] h-[102px] ml-[7.9px] rotate-[22.04deg] [font-family:'Kaushan_Script-Regular',Helvetica] font-normal text-white text-[70px] tracking-[0] leading-[normal]">
          E
        </div>
      </div>

      {/* Category Buttons */}
      <div className="absolute top-[189px] left-[23px] w-[344px] h-[55px]">
        {categories.map((category, index) => (
          <div key={category.name} className="absolute top-0" style={{ left: `${index * 73}px` }}>
            <button
              onClick={() => handleCategoryClick(category.name)}
              className={`w-[53px] h-[55px] rounded-[19.88px] bg-[linear-gradient(180deg,rgba(128,255,224,0.2)_0%,rgba(43,216,208,0.5)_50%,rgba(0,140,255,1)_100%)] hover:scale-105 transition-transform duration-300 flex items-center justify-center ${
                selectedCategories.includes(category.name) 
                  ? 'ring-2 ring-white/50 shadow-lg' 
                  : ''
              }`}
            >
              <span className="text-white text-xl">{category.icon}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Category Labels */}
      <div className="absolute top-[233px] left-[17px]">
        {categories.map((category, index) => (
          <div 
            key={category.name}
            className="absolute top-0 [font-family:'Kodchasan-Regular',Helvetica] font-normal text-white text-[11.6px] tracking-[1.51px] leading-[37.7px]"
            style={{ left: `${index * 73}px`, width: `${category.name === 'Produce' ? '68px' : category.name === 'Dairy' ? '44px' : category.name === 'Meat' ? '42px' : category.name === 'Pantry' ? '71px' : '61px'}` }}
          >
            {category.name}
          </div>
        ))}
      </div>

      {/* Gradient Bar */}
      <div className="absolute top-[98px] left-[19px] w-[346px] h-[46px] rounded-[19.88px] bg-[linear-gradient(270deg,rgba(128,255,224,0.2)_0%,rgba(43,216,208,0.5)_50%,rgba(0,140,255,1)_100%)]" />

      {/* Table Headers */}
      <div className="flex w-[263px] items-center justify-center gap-[15.26px] absolute top-[333px] left-[calc(50.00%_-_147px)]">
        <div className="flex w-[263px] items-center gap-[23px] relative">
          <div className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Kodchasan-Regular',Helvetica] font-normal text-white text-[12.4px] tracking-[1.61px] leading-[40.2px] whitespace-nowrap">
            Product
          </div>
          <div className="relative flex items-center justify-center w-[59px] [font-family:'Kodchasan-Regular',Helvetica] font-normal text-white text-[12.4px] tracking-[1.61px] leading-[13.4px]">
            Date <br />
            Bought
          </div>
          <div className="relative flex items-center justify-center w-fit [font-family:'Kodchasan-Regular',Helvetica] font-normal text-white text-[12.4px] tracking-[1.61px] leading-[13.9px]">
            Expiration
            <br /> Date
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="absolute top-[369px] left-[19px] w-[346px]">
        {loading && (
          <div className="text-center py-8 text-white/60 [font-family:'Kodchasan-Regular',Helvetica] font-normal text-[12.4px]">
            Loading items...
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4 [font-family:'Kodchasan-Regular',Helvetica] font-normal text-[12.4px]">Error: {error}</p>
            <button 
              onClick={refetchItems}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}
        
        {!loading && !error && (
          <div className="space-y-2">
            {filteredItems.slice(0, 8).map((item, index) => (
              <div key={index} className="flex w-[263px] items-center gap-[23px] relative">
                <div className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Kodchasan-Regular',Helvetica] font-normal text-white text-[12.4px] tracking-[1.61px] leading-[40.2px] whitespace-nowrap">
                  <span className="mr-2">{item.icon || "📦"}</span>
                  {item.name}
                </div>
                <div className="relative flex items-center justify-center w-[59px] [font-family:'Kodchasan-Regular',Helvetica] font-normal text-white text-[12.4px] tracking-[1.61px] leading-[13.4px]">
                  {item.dateAdded || "N/A"}
                </div>
                <div className="relative flex items-center justify-center w-fit [font-family:'Kodchasan-Regular',Helvetica] font-normal text-white text-[12.4px] tracking-[1.61px] leading-[13.9px]">
                  {item.expiryDate}
                </div>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-white/60 [font-family:'Kodchasan-Regular',Helvetica] font-normal text-[12.4px]">
                {selectedCategories.length > 0 
                  ? `No items found in selected categories: ${selectedCategories.join(', ').toLowerCase()}`
                  : "No items in your fridge yet"
                }
              </div>
            )}
          </div>
        )}
      </div>

      {/* Trash Icons */}
      <div className="flex flex-col w-6 items-start gap-[45px] absolute top-[340px] left-[318px]">
        <div className="relative self-stretch w-full flex-[0_0_auto] text-white/60 hover:text-white cursor-pointer transition-colors">
          🗑️
        </div>
        <div className="relative self-stretch w-full flex-[0_0_auto] text-white/60 hover:text-white cursor-pointer transition-colors">
          🗑️
        </div>
        <div className="relative self-stretch w-full flex-[0_0_auto] text-white/60 hover:text-white cursor-pointer transition-colors">
          🗑️
        </div>
      </div>

      {/* Bottom Navigation Icons */}
      <div className="absolute top-[787px] left-[25px] w-[39px] h-[39px] flex items-center justify-center">
        <span className="text-white text-3xl">🏠</span>
      </div>
      <div className="absolute top-[787px] left-[120px] w-[39px] h-[39px] flex items-center justify-center">
        <span className="text-white text-3xl">📷</span>
      </div>
      <div className="absolute top-[787px] left-[211px] w-[39px] h-[39px] flex items-center justify-center">
        <span className="text-white text-3xl">📅</span>
      </div>
      <div className="absolute top-[787px] left-[327px] w-[39px] h-[39px] flex items-center justify-center relative">
        <span className="text-white text-3xl">🔔</span>
        {hasNotifications && (
          <div className="absolute top-2 right-0 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaveXHomePage;