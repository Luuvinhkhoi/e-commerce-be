import './cart.css'
import {useNavigate, useLocation} from 'react-router-dom'
import {store} from '../../store/store.js'
import { useSelector, useDispatch } from 'react-redux'
import { getCart, updateCart, deleteCart } from '../../store/cartSlice'
import { minusQuantityToBuy, addQuantityToBuy } from '../../store/cartSlice'
import { useEffect } from 'react'
export const Cart = () =>{
    const items=useSelector((state)=>state.cart.items)
    const dispatch=useDispatch()
    const location=useLocation()
    const navigate=useNavigate()
    const totalPrice = items.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);
    const tax = totalPrice * 0.02
    const hasUnsavedChanges = useSelector(state => state.cart.hasUnsavedChanges);
    const handleQuantityChange = async (product_id, change) => {
        if (change === -1) {
            // Decrease quantity
            console.log('hihi')
            await dispatch(minusQuantityToBuy(product_id));
            // If quantity drops to 0, dispatch deleteCart
            const updateitems=store.getState().cart.items
            const item = updateitems.find(item => item.product_id === product_id);
            if (!item || item.quantity === 0) {
                dispatch(deleteCart({ id: product_id }));
            }
        } else {
            // Increase quantity
            dispatch(addQuantityToBuy(product_id));
        }
    };
    useEffect(() => {
        async function getCartItems() {
            await dispatch(getCart());
        }
        getCartItems();
    }, [dispatch]);
    useEffect(() => {
        // Lưu URL hiện tại để theo dõi trang
        const currentPath = location.pathname;

        // Function gửi cart lên server
        const saveCart = async () => {
            if (hasUnsavedChanges) {
                await dispatch(updateCart(items));
                console.log("Cart data saved!");
            }
        };

        // Xử lý khi tải lại trang hoặc đóng tab
        const handleBeforeUnload = (event) => {
            if (hasUnsavedChanges) {
                saveCart();
            }
        };

        // Xử lý back/forward trên trình duyệt
        const handlePopState = () => {
            if (currentPath === "/cart") {
                saveCart();
            }
        };

        // Đăng ký event listeners
        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("popstate", handlePopState);

        // Cleanup function
        return () => {
            saveCart(); // Lưu lại trước khi component unmount
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handlePopState);
        };
    }, [location.pathname, dispatch, hasUnsavedChanges]);

    
    return(
        <div className='cart'>
            <div className='cart-row-1'>
                <div>Item</div>
                <div>Quantity</div>
                <div>Price</div>
                <div>Total Price</div>
            </div>
            <div className='cart-row-2'>
                  {items.map(item=>
                    <div className='cart-row-2-item' key={item.product_id}>
                        <div className='item-image-name-author'>
                            <img src={item.cloudinary_url}></img>
                            <div className='item-name-author'>
                                <p>{item.product_name}</p>
                                <span>{item.author}</span>
                            </div>
                        </div>
                        <div className='item-quantity'>
                            <button onClick={() => handleQuantityChange(item.product_id, -1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => handleQuantityChange(item.product_id, 1)}>+</button>
                        </div>
                        <div className='item-price'>
                            <span>{item.price}</span>
                        </div>
                        <div className='item-total-price'>
                            <span>{(item.price * item.quantity)}</span>
                        </div>
                    </div>
                  )}
            </div>
            <div className='cart-row-3'>
                <div className='cart-row-3-col-1'>
                    <p>Shoping Summary</p>
                    <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>
                </div>
                <div className='cart-row-3-col-2'>
                    <div className='cart-row-3-col-2-row-1'>
                        <div>
                            <span>Subtotal</span>
                            <br></br>
                            <span>Tax</span>
                        </div>
                        <div>
                            <p>{totalPrice}</p>
                            <p>{tax}</p>
                        </div>
                    </div>
                    <div className='cart-row-3-col-2-row-2'>
                        <span>Total</span>
                        <p>{(totalPrice+tax)}</p>
                    </div>
                    <div className='checkout-button'>Check out</div>
                    <div className='continue' onClick={() => navigate('/')}>Continue Shoping</div>
                </div>
            </div>
            
        </div>
    )
}