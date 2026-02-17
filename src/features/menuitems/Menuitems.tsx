import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import MenuitemHeader from './MenuitemHeader';
import ListMenuitems from './ListMenuitems';
import ViewMenuitem from './ViewMenuitem';
import AddMenuitem from './AddMenuitem';

const Menuitems = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    return (
        <div>
            <BrowserRouter>
                <MenuitemHeader />
                <Routes>
                    <Route path='/' element={<ListMenuitems />} />
                    <Route path='/:menuitemId' element={<ViewMenuitem />} />
                    <Route
                        path='/add-menuitem'
                        element={<AddMenuitem setShowSuccess={setShowSuccess} />}
                    />
                </Routes>
            </BrowserRouter>
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
