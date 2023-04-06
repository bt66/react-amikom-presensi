import Header from "../../components/Header";
import React, { useState,useRef } from 'react';
import { QrReader } from 'react-qr-reader';
import classes from "./Presensi.module.scss";
import { Notifications } from 'react-push-notification';
import addNotification from 'react-push-notification';
import axios from "axios";
import Slider from '@mui/material/Slider';
import ReactLoading from "react-loading";
// import Loading from '../../components/Loading';

const PresensiPage = () => {

    const loadingRef = useRef();
    console.log(loadingRef)

    // qr and code data
    const [data, setData] = useState('No result');
    const [dataMHS, setdataMHS] = useState({
        nim: "",
        device_id: "",
        pw: ""
    })
    const [localStorageState, setLocalStorageState] = useState({
        nim: `${localStorage.getItem('nim')}`,
        device_id: `${localStorage.getItem('device_id')}`,
        pw: `${localStorage.getItem('pw')}`,
    })
    
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [zoomData, setZoomData] = useState('');

    function handleClear(e) {
        e.preventDefault();
        setData('No result');
    }
    const handleSubmit = (event) => {
        console.log("submitted")
        event.preventDefault();
        console.log(dataMHS);
        localStorage.setItem('nim', dataMHS.nim)
        localStorage.setItem('pw', dataMHS.pw)
        localStorage.setItem('device_id', dataMHS.device_id)
        setLocalStorageState(dataMHS)
        addNotification({
            title: 'Success',
            subtitle: `Data is saved`,
            message: `NIM : ${dataMHS.nim} Data mhs : ${dataMHS.pw} Device ID : ${dataMHS.device_id}`,
            theme: 'green',
            native: false // when using native, your OS will handle theming.
        });
        setdataMHS({
            nim: "",
            device_id: "",
            pw: ""
        })
    }
    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setdataMHS((prevProps) => ({
            ...prevProps,
            [name]: value
        }))
    }
    
    const handleChangeSlider = (event) => {
        setZoomData(event.target.value)
        // localStorage.setItem('ngezoom', JSON.stringify(event.target.value))
        console.log(zoomData)
    }
    
    
    // handle clear localstorage
    const hadleDeleteLocalStorage = (event) => {
        localStorage.removeItem("nim")
        localStorage.removeItem("pw")
        localStorage.removeItem("device_id")
        setLocalStorageState({
            nim: "",
            device_id: "",
            pw: ""
        })
        addNotification({
            title: 'Success',
            subtitle: "Delete data success",
            theme: 'green',
            native: false // when using native, your OS will handle theming.
        });
    }
    // request to get token rest API
    const handleGetToken = (event) => {
        setIsLoading(true)
        console.log(loadingRef)
        axios.post(`https://proxy-cors.carakan.id/https://ds.amikom.ac.id/api/amikomone/auth`,new URLSearchParams({
            user_id:`${localStorage.getItem('nim')}`,
            password: `${localStorage.getItem('pw')}`,
            device_id: `${localStorage.getItem('device_id')}`
        }),
        {
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded', 
                'Host': 'ds.amikom.ac.id', 
                'User-Agent': 'okhttp/5.0.0-alpha.2'
            },
        }).then((resp => {
            setIsLoading(false)
            // console.log(resp.data.access_token)
            setToken(resp.data.access_token)
            // console.log(resp.status)
            addNotification({
                title: 'Success',
                subtitle: "Get token success",
                message: `your token : ${resp.data.access_token}`,
                theme: 'green',
                native: false // when using native, your OS will handle theming.
            });
            console.log('ini no err')
            // console.log(notification.msg)
        })
        ).catch((error) => {
            setIsLoading(false)
            addNotification({
                title: 'Get token failed',
                subtitle: `Status code : ${error.response.status}`,
                message: `Ensure you fill data mhs correctly`,
                theme: 'success',
                native: false // when using native, your OS will handle theming.
            });
            console.log(error.response.status)
        })
    }
    // request to presensi rest API
    const presensi = (event) => {
        event.preventDefault();
        setIsLoading(true)
        axios.post(`https://proxy-cors.carakan.id/https://ds.amikom.ac.id/api/amikomone/presensi_mobile/validate_qr_code`,JSON.stringify({
                "data": `${data};${localStorage.getItem('nim')}`,
                "location": "Amikom"
            }),
            {
                headers: { 
                    'Content-Type': 'application/json', 
                    'Host': 'ds.amikom.ac.id', 
                    'User-Agent': 'okhttp/5.0.0-alpha.2', 
                    'Authorization': `Bearer ${token}`
                },
            }).then((resp => {
                setIsLoading(false)
                // console.log(resp.status)
                addNotification({
                    title: 'Success',
                    subtitle: "Presence Success",
                    message: `Success with status ${resp.status}`,
                    theme: 'green',
                    native: false // when using native, your OS will handle theming.
                });
                // console.log('ini response')
                console.log(resp.data)
                // setNotification({
                //     showNotification: true,
                //     msg: [...notification.msg, resp.status]
                // })
                // console.log('ini no err')
                // console.log(notification.msg)
            })
            ).catch((error) => {
                setIsLoading(false)
                // addNotification({
                //     title: 'Failed',
                //     message: `Response code ${error.message}`,
                //     subtitle: `${error.code}`,
                //     theme: 'red',
                //     native: false // when using native, your OS will handle theming.
                // });
                // console.log(error.response.status)
                // console.log(typeof(error.response.status))
                if(`${error.response.status}` == '422') {
                    addNotification({
                        title: 'Already Presence',
                        subtitle: `Status code : ${error.response.status}`,
                        message: `You Already Presence`,
                        theme: 'light',
                        native: false // when using native, your OS will handle theming.
                    });
                }else if (`${error.response.status}` == '401') {
                    addNotification({
                        title: 'Presence Failed',
                        subtitle: `Status code : ${error.response.status}`,
                        message: `Check your credential and ensure your qr code are valid`,
                        theme: 'red',
                        native: false // when using native, your OS will handle theming.
                    });
                }else {
                    addNotification({
                        title: 'Failed',
                        message: `Response code ${error.message}`,
                        subtitle: `${error.code}`,
                        theme: 'red',
                        native: false // when using native, your OS will handle theming.
                    });
                }
                // console.log(error)
            }
        )
    }


    const presenceWithGetTokenFirst = (event) => {
        event.preventDefault();
        setIsLoading(true)

        // get token
        axios.post(`https://proxy-cors.carakan.id/https://ds.amikom.ac.id/api/amikomone/auth`,new URLSearchParams({
            user_id:`${localStorage.getItem('nim')}`,
            password: `${localStorage.getItem('pw')}`,
            device_id: `${localStorage.getItem('device_id')}`
        }),
        {
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded', 
                'Host': 'ds.amikom.ac.id', 
                'User-Agent': 'okhttp/5.0.0-alpha.2'
            },
        }).then((resp => {
            // console.log(resp.data.access_token)
            // console.log(resp.status)
            addNotification({
                title: 'Success',
                subtitle: "Get token success",
                message: `your token : ${resp.data.access_token}`,
                theme: 'green',
                native: false // when using native, your OS will handle theming.
            });
            setToken(resp.data.access_token)

            axios.post(`https://proxy-cors.carakan.id/https://ds.amikom.ac.id/api/amikomone/presensi_mobile/validate_qr_code`,JSON.stringify({
                    "data": `${data};${localStorageState.nim}`,
                    "location": "Amikom"
                }),
                {
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Host': 'ds.amikom.ac.id', 
                        'User-Agent': 'okhttp/5.0.0-alpha.2', 
                        'Authorization': `Bearer ${resp.data.access_token}`
                    },
                }).then((resp => {
                    setIsLoading(false)
                    // console.log(resp.status)
                    addNotification({
                        title: 'Success',
                        subtitle: "Presence Success",
                        message: `Success with status ${resp.status}`,
                        theme: 'green',
                        native: false // when using native, your OS will handle theming.
                    });
                    // console.log('ini response')
                    console.log(resp.data)
                    // setNotification({
                    //     showNotification: true,
                    //     msg: [...notification.msg, resp.status]
                    // })
                    // console.log('ini no err')
                    // console.log(notification.msg)
                })
                ).catch((error) => {
                    setIsLoading(false)
                    // addNotification({
                    //     title: 'Failed',
                    //     message: `Response code ${error.message}`,
                    //     subtitle: `${error.code}`,
                    //     theme: 'red',
                    //     native: false // when using native, your OS will handle theming.
                    // });
                    // console.log(error.response.status)
                    // console.log(typeof(error.response.status))
                    if(`${error.response.status}` == '422') {
                        addNotification({
                            title: 'Already Presence',
                            subtitle: `Status code : ${error.response.status}`,
                            message: `You Already Presence`,
                            theme: 'light',
                            native: false // when using native, your OS will handle theming.
                        });
                    }else if (`${error.response.status}` == '401') {
                        addNotification({
                            title: 'Presence Failed',
                            subtitle: `Status code : ${error.response.status}`,
                            message: `Check your credential and ensure your qr code are valid`,
                            theme: 'red',
                            native: false // when using native, your OS will handle theming.
                        });
                    }else {
                        addNotification({
                            title: 'Failed',
                            message: `Response code ${error.message}`,
                            subtitle: `${error.code}`,
                            theme: 'red',
                            native: false // when using native, your OS will handle theming.
                        });
                    }
                    // console.log(error)
                })

        })
        ).catch((error) => {
            setIsLoading(false)
            addNotification({
                title: 'Get token failed',
                subtitle: `Status code : ${error.response.status}`,
                message: `Ensure you fill data mhs correctly`,
                theme: 'success',
                native: false // when using native, your OS will handle theming.
            });
            console.log(error.response.status)
        })
    } 


    return(
        <div className={classes.content}>
            {isLoading ? 
                <div ref={loadingRef} className={`${classes.content__loadingScreen}`}>
                    <div className={classes.content__loadingScreen__icon}>
                        <ReactLoading type="spin" color="rgb(226, 116, 26)" height={100} width={100} />
                    </div>
                </div>
            :
            <div ref={loadingRef} className={`${classes.content__loadingScreenHidden}`}>
                <div className={classes.content__loadingScreen__icon}>
                    <ReactLoading type="spin" color="rgb(226, 116, 26)" height={100} width={100} />
                </div>
            </div>
            }
            <Notifications />
            {/* <div ref={loadingRef} className={classes.content__loadingScreen}>
                <Loading />
            </div> */}
            <Header/>
            <div className={classes.content__qrConteiner}>
                <QrReader
                    key={zoomData}
                    onResult={(result, error) => {
                    if (!!result) {
                        setData(result?.text);
                    }

                    if (!!error) {
                        console.info(error);
                    }
                    }}
                    style={{ width: '100%'}}
                    // cameraStyle={{ height: 200, marginTop: 20, width: 200, alignSelf: 'center', justifyContent: 'center' }}
                    constraints={{
                        facingMode: 'environment',
                        zoom: zoomData
                        // zoom: JSON.parse(localStorage.getItem('ngezoom'))
                        // advanced: [{}]
                    }}
                />
            </div>
            <p>{process.env.REACT_APP_DEPLOYMENT_URL}</p>
            <h3>Zoom value : {zoomData}</h3>
            <div className={classes.content__sliderContainer}>
                <Slider
                    size="small"
                    defaultValue={2}
                    min={0}
                    step={1}
                    max={10}
                    aria-label="Small"
                    valueLabelDisplay="auto"
                    onChange={handleChangeSlider}
                />
            </div>
            <div className={classes.content__form}>
                <h3>Qrcode Data :</h3>
                <p className={classes.content__form__qrResult}>{data}</p>
                <p>automatic methode :</p>
                <div className={classes.content__buttonActionContainer}>
                    <div className={classes.content__buttonActionContainer__buttonAction}>
                        <button onClick={presenceWithGetTokenFirst} className={classes.btnOk}>Presence include get token</button>
                    </div>
                </div>
                <p>manual methode :</p>
                <div className={classes.content__buttonActionContainer}>
                    <div className={classes.content__buttonActionContainer__buttonAction}>
                        <button onClick={handleGetToken} className={classes.btnSubmit}>Get Token</button>
                        <button onClick={handleClear} className={classes.btnDelete}>Clear QR Data</button>
                        <button onClick={presensi} className={classes.btnOk}>Presensi!</button>
                    </div>
                </div>
                <h3>Input your data : </h3>
                <div className={classes.content__form__inputDataContainer}>
                    <form onSubmit={handleSubmit}>
                        <div className={classes.content__form__inputDataContainer__content}>
                            <input 
                                type="nim" 
                                name="nim" 
                                placeholder='nim' 
                                value={dataMHS.nim}
                                onChange={handleInputChange}
                                className={classes.inputForm}/>
                        </div>
                        <div className={classes.content__form__inputDataContainer__content}>
                            <input 
                                type="device_id" 
                                name="device_id" 
                                placeholder='device_id' 
                                value={dataMHS.device_id}
                                onChange={handleInputChange}
                                className={classes.inputForm}/>
                        </div>
                        <div className={classes.content__form__inputDataContainer__content}>
                            <input 
                                type="password" 
                                name="pw" 
                                placeholder='pw' 
                                value={dataMHS.pw}
                                onChange={handleInputChange}
                                className={classes.inputForm}/>
                        </div>
                        <div className={classes.content__form__inputDataContainer__inputButton}>
                            <input type="submit" className={classes.btnOk} />
                        </div>
                    </form>
                </div>
                <div className={classes.content__form__datamhsContainer}>
                    <h3>Your data : </h3>
                    <div className={classes.content__form__datamhsContainer__tabel}>
                        <table>
                            <tbody>
                                <tr>
                                    <th>NIM</th>
                                    <td>{localStorageState.nim}</td>
                                </tr>
                                <tr>
                                    <th>Password</th>
                                    <td>{localStorageState.pw}</td>
                                </tr>
                                <tr>
                                    <th>Device ID</th>
                                    <td>{localStorageState.device_id}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={classes.content__form__datamhsContainer__buttonDeleteConteiner}>
                        <button onClick={hadleDeleteLocalStorage} className={classes.btnDelete}>delete data mhs</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PresensiPage