import React from 'react'

const ListNim = (props) => {
    return (
        <>
            <table>
                <tr>
                    <th>No</th>
                    <th>NIM</th>
                    <th>Action</th>
                </tr>
                {props.nimData.map(( data, index) => {
                    <tr key={index}>
                        <td>{index}</td>
                        <td>{data.nim}</td>
                    </tr>
                })}
            </table>
        </>
    )
}

export default ListNim
