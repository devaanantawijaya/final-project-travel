import Navbar from "@/components/Navbar";

const CartPage = () => {
  return (
    <div>
      <Navbar />
      <div className="pt-28 px-20">
        <div className="flex justify-between">
          <h1>Your Cart</h1>
          <p>0 item</p>
        </div>
        <div className="flex justify-between">
          <h1>Select All Items</h1>
          <p>{`0 item(s) selected`}</p>
        </div>
        <div className="flex gap-10">
          <div className="bg-slate-300 w-[70%] h-fit">
            <div className="grid grid-cols-[1fr_3fr_2fr_2fr_2fr]">
              {/* Header */}
              <div>
                <h1 className="py-5 text-center">Select</h1>
              </div>
              <div>
                <h1 className="py-5 text-left">Activity</h1>
              </div>
              <div>
                <h1 className="py-5 text-center">Price</h1>
              </div>
              <div>
                <h1 className="py-5 text-center">Quantity</h1>
              </div>
              <div>
                <h1 className="py-5 text-center">Total</h1>
              </div>

              {/* Content */}
              {/* 1. Select */}
              <div className="flex items-center justify-center">
                <p>O</p>
              </div>

              {/* 2. Activity */}
              <div className="flex items-center gap-3 py-3">
                <div className="overflow-hidden w-28">
                  <img
                    src="/images/404.png"
                    alt="images"
                    className="aspect-square object-cover"
                  />
                </div>
                <div>
                  <h1>Sea World</h1>
                  <p>Lokasi</p>
                  <p>Added on</p>
                  <p className="text-xs">Sabtu, 25 Januari 2025</p>
                  <p className="text-xs">pukul 12.00</p>
                </div>
              </div>

              {/* 3. Price */}
              <div className="flex flex-col items-center justify-center">
                <p>Rp. 100.000</p>
                <p className="line-through">Rp. 1.000.000</p>
              </div>

              {/* 4. Quantity */}
              <div className="flex items-center justify-center">
                <p>{`----- 0 ++++`}</p>
              </div>

              {/* 5. Total */}
              <div className="flex items-center justify-center">
                <p>Rp. 1.000.000 O</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-600 w-[30%] h-96">summary</div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
