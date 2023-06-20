import React, { useEffect, useRef, useState } from 'react'
import { StripeContainer } from '../StripeContainer.js/StripeContainer';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getGigDetail, getUserGigs } from '../../actions/gigAction'
import { FiCheck } from 'react-icons/fi'
import { IoClose } from 'react-icons/io5'
import { AiFillQuestionCircle } from 'react-icons/ai'
import { Tooltip } from '../Tooltip/Tooltip.js';
import { DataSendingLoading } from '../DataSendingLoading/DataSendingLoading.js'

const stripePromise = loadStripe('pk_test_51MtFFeSAmwdBmm1f0hqgnIYATUgc4R2mqS4M35gX3zAFo870EWa7DPOSpM79cBBJbHYkAN4qEKbDdukHEpYxdOXd00xnfGsKMi');

export const PlaceOrder = () => {
    const dispatch = useDispatch();
    const params = useParams();

    const [loading, setLoading] = useState(false);
    const stripeContainerRef = useRef(null);


    useEffect(() => {
        dispatch(getGigDetail(params.id));
    }, [dispatch, params.id])

    const { gigDetail } = useSelector(state => state.gigDetail)
    const packageNumber = params.packageNumber;
    const packageDetail = gigDetail?.pricing[packageNumber];
    // console.log(packageDetail);

    const handleConfirmPaymentClick = async () => {
        await stripeContainerRef.current.callSubmit();
    }


    return (
        <div className='relative'>
            <DataSendingLoading
                finishedLoading={!loading}
                show={loading}
            />
            <div className='px-8 py-12 md:px-32 flex flex-col items-center gap-16 min-[1050px]:px-12 min-[1050px]:flex-row min-[1050px]:justify-between min-[1050px]:items-start xl:px-24 xl:justify-center xl:gap-32' >
                <div className='xl:flex-1 2xl:flex-none'>
                    <Elements stripe={stripePromise}>
                        <StripeContainer
                            ref={stripeContainerRef}
                            setParentLoadingStatus={setLoading}
                        />
                    </Elements>
                </div>

                {
                    gigDetail &&
                    <div className='bg-separator max-w-sm rounded-[3] text-light_heading border border-dark_separator'>
                        <div className='p-4'>
                            <div className='flex gap-4 pb-4 border-b border-no_focus items-center'>
                                <div>
                                    <img src={gigDetail.images[0].imgUrl} alt='gig showcase' className='max-w-[120px] aspect-[16/10]  rounded-[4px]' />
                                </div>
                                <h3 className='leading-6 font-semibold'>{gigDetail.title}</h3>
                            </div>
                            <div>
                                <div className='flex justify-between mt-3'>
                                    <h4 className='font-bold'>{packageDetail.packageTitle}</h4>
                                    <p>₹{Number(packageDetail.packagePrice).toFixed(2)}</p>
                                </div>
                                <div className='mt-4'>
                                    <ul className='flex flex-col gap-2'>
                                        <li className='grid grid-cols-[30px_auto] items-center'>
                                            <FiCheck className='text-green font-bold text-xl' />
                                            <span>{packageDetail.revisions} {packageDetail.revisions === 1 ? 'revision' : 'revisions'}</span>
                                        </li>
                                        <li className='grid grid-cols-[30px_auto] items-center'>
                                            {
                                                packageDetail.commercialUse ?
                                                    <FiCheck className='text-green font-bold text-xl' />
                                                    :
                                                    <IoClose className='text-error font-bold text-xl' />
                                            }
                                            <span className=''>Commercial Use</span>
                                        </li>
                                        <li className='grid grid-cols-[30px_auto] items-center'>
                                            {
                                                packageDetail.sourceFile ?
                                                    <FiCheck className='text-green font-bold text-xl' />
                                                    :
                                                    <IoClose className='text-error text-xl' />
                                            }
                                            <span>Source File</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white border-x-0 border-y border-dark_separator'>
                            <div className='px-4 py-3 flex items-center justify-between'>
                                <div className='flex gap-1'>
                                    <div>Service Fee </div>
                                    {/* <Tooltip
                                        id='serviceFee'
                                        place='top'
                                        content='This helps us to operate our platform and offer 24/7 customer support for your orders.'
                                    /> */}
                                    <AiFillQuestionCircle
                                        id='serviceFee'
                                        className='text-no_focus no-select'
                                        data-tooltip-id="my-tooltip"
                                        data-tooltip-content="This helps us to operate our platform and offer 24/7 customer support for your orders."
                                        data-tooltip-place='bottom'
                                    />
                                </div>
                                <div>₹{(Number(packageDetail.packagePrice) * 0.21).toFixed(2)}</div>
                            </div>
                        </div>
                        <div className=' bg-white px-4 py-3 flex items-center justify-between text-[18px]'>
                            <div className='font-bold'>Total</div>
                            <div className='font-bold'>₹{(Number(packageDetail.packagePrice) * 1.21).toFixed(2)}</div>
                        </div>
                        <div className='bg-white px-4 flex items-center justify-between'>
                            <div className=''>Total delivery Time</div>
                            <div>{packageDetail.packageDeliveryTime.replace('delivery', '')}</div>
                        </div>
                        <div className='px-4 pt-12 bg-white'>
                            <button onClick={handleConfirmPaymentClick} className='px-4 py-3 w-full bg-dark_grey text-white rounded-[4px] hover:cursor-pointer hover:bg-light_grey'>Confirm & Pay</button>
                            <p className='py-3 text-center text-no_focus text-[14px] leading-5'>You will be charged ₹{(Number(packageDetail.packagePrice) * 1.21).toFixed(2)}. Total amount includes currency conversion fees.</p>
                        </div>
                    </div>
                }

            </div>
        </div>

    )
}
