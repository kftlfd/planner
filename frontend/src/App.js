import React, { useEffect, useState } from "react";
import './App.scss'

export default function App() {
  const [ data, setData ] = useState(null);
  const [ loading, setLoading ] = useState(true);

  useEffect( ()=>{

    fetch('/api/')
    .then(res => res.json())
    .then(result => {
      let tmp = JSON.stringify(result);
      console.log('api fetch: ' + tmp);
      setData(tmp);
    })
    .catch(e => {
      console.error(e);
      setData('Failed to load user');
    })
    .finally(() => {
      setLoading(false)
    })

  }, [] )

  if (loading) {
    return(
      <h1>Loading</h1>
    )
  } else {
    return(
      <>
        <h1>Loaded</h1>
        <pre>{data}</pre>
      </>
    )
  }

}
