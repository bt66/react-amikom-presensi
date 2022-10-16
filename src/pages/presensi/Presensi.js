import Header from "../../components/Header";
import React, { useEffect, useState } from 'react';
import { QrReader } from 'react-qr-reader';
import classes from "./Presensi.module.scss";
import Notification from "./Notification";
import axios from "axios";
import Slider from '@mui/material/Slider';

const PresensiPage = () => {
    const [data, setData] = useState('No result');
    const [dataMHS, setdataMHS] = useState({
        formData: "",
        nim: []
    })
    const [zoomData, setZoomData] = useState('')
    const [qrZoom, setQrZoom] = useState('')
    const [notification, setNotification] = useState({
        showNotification: false,
        msg: []
    })

    useEffect(() => {
        setQrZoom(zoomData)
        
    }, [zoomData])
    function handleClear(e) {
        e.preventDefault();
        setData('No result');
    }
    const handleSubmit = (event) => {
        console.log("submitted")
        event.preventDefault();
        console.log(dataMHS);
        setdataMHS({
            nim: [...dataMHS.nim, dataMHS.formData],
            formData: ""
        })
    }
    const handleChange = (event) => {
        // event.preventDefault();
        setdataMHS({
            formData: event.target.value,
            nim: [...dataMHS.nim]
        })
        console.log(event.target.value)

    }

    const handleChangeSlider = (event) => {
        setZoomData(event.target.value)
        localStorage.setItem('ngezoom', JSON.stringify(event.target.value))
        console.log(zoomData)
    }
    // request to presensi rest API
    const presensi = (event) => {
        event.preventDefault();

        setNotification({
            showNotification: false,
            msg: []
        })
        // console.log('ini notif msg kosong')
        // console.log(notification.msg)
        dataMHS.nim.map((npm, index) => {
            axios.post('https://dev-backend-pr.tranto.tk/',{
                qrData:`${data}`,
                nim: `${npm}`
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((resp => {
                // console.log('ini response')
                // console.log(resp)
                setNotification({
                    showNotification: true,
                    msg: [...notification.msg, resp.status]
                })
                console.log('ini no err')
                console.log(notification.msg)
            })
            ).catch((error) => {
                // console.log(error.response.status)
                setNotification({
                    showNotification: true,
                    msg: [...notification.msg, error.response.status]
                })
                // console.log('ini error')
                // console.log(notification.msg)
            })
        })

        setTimeout(() => {
            setNotification({
                showNotification: false,
                msg: []
            });
        }, 5000);
    }


    return(
        <div className={classes.content}>
            <Header/>
            { notification.showNotification &&
                <div className={classes.content__notification}>
                    {notification.msg.map((message, index) => {
                        console.log(`${index}-${message}`)
                    })}
                    <Notification msg={notification.msg}/>
                </div>
            }
            <div>
                {/* <QrReader
                    onResult={(result, error) => {
                    if (!!result) {
                        setData(result?.text);
                    }

                    if (!!error) {
                        console.info(error);
                    }
                    }}
                    style={{ width: '100%'}}
                    constraints={{
                        facingMode: 'environment',
                        zoom: JSON.parse(localStorage.getItem('ngezoom'))
                        // advanced: [{}]
                    }}
                /> */}
            </div>
            <p>{JSON.parse(localStorage.getItem('ngezoom'))}</p>
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
                <p>Qrcode Data :</p>
                <p className={classes.content__form__qrResult}>{data}</p>
                <button onClick={handleClear} className={classes.btnDelete}>Clear QR Data</button>
                <div>
                    <p>Input your NIM : </p>    
                    <form onSubmit={handleSubmit}>
                        <input type="text" 
                            name="nim"
                            value={dataMHS.formData}
                            placeholder="nim"
                            onChange={handleChange}
                            className={classes.inputForm}
                        />
                        <input type="submit" className={classes.btnSubmit}/>
                    </form>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>NIM</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataMHS.nim.map(( data, index) => 
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{data}</td>
                                <td><p>delete</p></td>
                            </tr>
                        )}
                    </tbody>
                    
                </table>
                <button onClick={presensi} className={classes.btnSubmit}>Presensi!</button>
            </div>
        </div>
    )
}

export default PresensiPage