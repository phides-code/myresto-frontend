import { useState } from 'react';
import { Route, Routes } from 'react-router';
import MenuitemsNav from './MenuitemsNav';
import ListMenuitems from './ListMenuitems';
import ViewMenuitem from './ViewMenuitem';
import AddMenuitem from './AddMenuitem';

const Menuitems = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    return (
        <div>
            <MenuitemsNav />
            <Routes>
                <Route index element={<ListMenuitems />} />
                <Route
                    path='add-menuitem'
                    element={<AddMenuitem setShowSuccess={setShowSuccess} />}
                />
                <Route path=':menuitemId' element={<ViewMenuitem />} />
            </Routes>
            {showSuccess && (
                <div>
                    <h2>Menuitem added successfully!</h2>
                    <button
                        onClick={() => {
                            setShowSuccess(false);
                        }}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
};
export default Menuitems;
