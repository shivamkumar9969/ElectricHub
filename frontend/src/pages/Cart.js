import React, { useContext, useEffect, useState } from 'react'
import SummaryApi from '../common'

import Context from '../context'
import displayINRCurrency from '../helpers/displayCurrency'
import { MdDelete } from "react-icons/md";

const Cart = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [orderConfirmed, setOrderConfirmed] = useState(false)
    const context = useContext(Context)
    const loadingCart = new Array(4).fill(null)

    const fetchData = async () => {
        const response = await fetch(SummaryApi.addToCartProductView.url, {
            method: SummaryApi.addToCartProductView.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
        })

        const responseData = await response.json()
        if (responseData.success) {
            setData(responseData.data)
        }
    }

    useEffect(() => {
        setLoading(true)
        fetchData()
        setLoading(false)
    }, [])

    // ✅ Handle Order Confirmation
    const handleConfirmOrder = async () => {
        const isConfirmed = window.confirm("Are you sure you want to place this order?"); // ✅ Show Confirmation Message

        if (isConfirmed) {
            try {
                const orderDetails = {
                    name: document.getElementById("name").value,
                    phone: document.getElementById("phone").value,
                    address: document.getElementById("address").value,
                    pincode: document.getElementById("pincode").value,
                    city: document.getElementById("city").value,
                    totalQty,
                    totalPrice
                }
                console.log('this is the oder details');

                // console.log("order details:", orderDetails);

                const response = await fetch(SummaryApi.createOrder.url, {
                    method: SummaryApi.createOrder.method,
                    credentials: 'include',
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(orderDetails)
                })

                const responseData = await response.json()
                console.log('response');
                console.log(responseData);

                if (responseData.success) {
                    setOrderConfirmed(true)
                    document.getElementById("name").value = "";
                    document.getElementById("phone").value = "";
                    document.getElementById("address").value = "";
                    document.getElementById("pincode").value = "";
                    document.getElementById("city").value = "";
                } else {
                    alert("Failed to confirm order. Please try again.")
                }

            } catch (err) {
                console.log(err);

            }

        }
    }

    const totalQty = data.reduce((prev, curr) => prev + curr.quantity, 0)
    const totalPrice = data.reduce((prev, curr) => prev + (curr.quantity * curr?.productId?.sellingPrice), 0)

    return (
        <div className='container mx-auto'>
            <div className='text-center text-lg my-3'>
                {data.length === 0 && !loading && <p className='bg-white py-5'>No Data</p>}
            </div>

            <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>
                {/*** Cart Items Section ***/}
                <div className='w-full max-w-3xl'>
                    {loading ? (
                        loadingCart.map((el, index) => (
                            <div key={index} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'></div>
                        ))
                    ) : (
                        data.map((product) => (
                            <div key={product?._id} className='w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]'>
                                <div className='w-32 h-32 bg-slate-200'>
                                    <img src={product?.productId?.productImage[0]} className='w-full h-full object-scale-down mix-blend-multiply' />
                                </div>
                                <div className='px-4 py-2 relative'>
                                    <div className='absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer' >
                                        <MdDelete />
                                    </div>
                                    <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1'>{product?.productId?.productName}</h2>
                                    <p className='capitalize text-slate-500'>{product?.productId.category}</p>
                                    <div className='flex items-center justify-between'>
                                        <p className='text-red-600 font-medium text-lg'>{displayINRCurrency(product?.productId?.sellingPrice)}</p>
                                        <p className='text-slate-600 font-semibold text-lg'>{displayINRCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/*** Order Summary Section ***/}
                <div className="mt-5 lg:mt-0 w-full max-w-sm">
                    <div className="bg-white shadow-md rounded-lg">
                        <h2 className="text-white bg-green-600 px-4 py-2 text-center">Place Order</h2>

                        <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between font-medium text-lg text-slate-600">
                                <p>Quantity</p>
                                <p id="totalQty">{totalQty}</p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" id="name" className="w-full px-4 py-2 border rounded-lg" />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                    <input type="tel" id="phone" className="w-full px-4 py-2 border rounded-lg" />
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                    <textarea id="address" rows="3" className="w-full px-4 py-2 border rounded-lg"></textarea>
                                </div>

                                <div>
                                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
                                    <input type="text" id="pincode" className="w-full px-4 py-2 border rounded-lg" />
                                </div>

                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                    <input type="text" id="city" className="w-full px-4 py-2 border rounded-lg" />
                                </div>
                            </div>

                            <div className="bg-green-100 text-green-700 p-2 rounded-md text-sm font-medium">
                                Cash on Delivery Available
                            </div>

                            <div className="flex items-center justify-between font-medium text-lg text-slate-600">
                                <p>Total Price</p>
                                <p>{displayINRCurrency(totalPrice)}</p>
                            </div>

                            {orderConfirmed ? (
                                <div className="text-center text-green-600 font-semibold">Order Confirmed! 🎉</div>
                            ) : (
                                <button onClick={handleConfirmOrder} className="bg-blue-600 p-2 text-white w-full rounded-lg">
                                    Confirm Order
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart
