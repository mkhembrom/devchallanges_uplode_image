import { useEffect, useRef, useState } from 'react'
import './App.css'
import axios from 'axios';
import { BsCheckCircleFill } from "react-icons/bs"
import Clipboard from 'react-clipboard-animation'

function App() {

  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [newImageFile, setNewImageFile] = useState("");
  const [uploaded, setUploaded] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const drop = useRef(null);

  const handleChange = (e) => {
    setImageFile(e.target.files[0]);
    const imageURL = URL.createObjectURL(e.target.files[0]);
    setImage(imageURL);
  }

  const handleUpload = async (e) => {
    e.preventDefault();

    try {

      let formdata = new FormData();
      formdata.append("upload", imageFile);
      setIsLoading(true);
      const { data } = await axios.post('https://mkuploadsapi.onrender.com/api/uploads', formdata, {
        onUploadProgress: (dataValue) => {
          setUploaded(Math.floor((dataValue.loaded / dataValue.total) * 100));
        }
      });
      setIsLoading(false);
      setNewImageFile(data?.url[0]);


    } catch (error) {
      console.log(error.message)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();


    const files = [...e.dataTransfer.files];

    if (files && files.length) {
      onUpload(files);
    }
  };

  const onUpload = (files) => {
    setImageFile(files[0]);
    const imageURL = URL.createObjectURL(files[0]);
    setImage(imageURL);
  };

  useEffect(() => {
    drop.current?.addEventListener('dragover', handleDragOver);
    drop.current?.addEventListener('drop', handleDrop);

    return () => {
      drop.current?.removeEventListener('dragover', handleDragOver);
      drop.current?.removeEventListener('drop', handleDrop);
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(newImageFile);
    setCopied(true);
  }

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (copied) setCopied(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [copied])


  if (isLoading) {
    return <>
      <div className='w-full min-h-screen bg-indigo-500 flex justify-center items-center'>
        <div className='rounded-md max-w-full md:max-w-[380px] w-full px-4 py-8 flex flex-col items-start justify-center bg-white shadow-xl m-4'>
          <h1 className='text-md text-gray-400 tracking-wide'>Uploading</h1>


          <div className='bg-gray-200 rounded-full w-full h-2 my-4'>
            <div className={` bg-blue-500 w-20 rounded-full h-full  animate_track`}></div>

          </div>

        </div>
      </div>
    </>
  }


  if (!isLoading && uploaded) {
    return (
      <div className='w-full min-h-screen bg-indigo-500 flex justify-center items-center'>
        <div className='rounded-md max-w-full md:max-w-[380px] w-full px-4 py-8 flex flex-col items-center justify-center bg-white shadow-xl m-4'>
          <h1 className='text-md font-bold tracking-wide'>
            <BsCheckCircleFill size={40} color="#219653" />
          </h1>
          <h2 className='text-md tracking-tight my-4'>Uploaded Successfully!</h2>



          <div className='border-dashed border-2 border-sky-500 h-52 w-full sm:w-80 rounded-xl my-4 flex flex-col justify-center items-center bg-gray-100 cursor-pointer overflow-hidden'>
            <img className='w-full h-full object-cover ' src={newImageFile} alt="" />
          </div>



          <div className=' sm:p-4 w-full h-10 rounded-full  flex justify-center items-center my-4 relative'>
            <input type="text" value={newImageFile} onChange={e => e.target.value} className='text-xs w-full h-full p-6 bg-gray-200 rounded-lg outline-stone-500' />
            <button onClick={() => handleCopy(newImageFile)} className='bg-blue-500 text-xs px-4 py-2 absolute right-5 top-0 flex justify-center items-center text-white rounded-md h-full'><span className='mr-2'>Copy Link</span><Clipboard
              copied={copied}
              setCopied={setCopied}
              text={newImageFile}
              color='white'
            /></button>

          </div>


        </div>
      </div>
    );
  }



  return (
    <div className='w-full min-h-screen bg-indigo-500 flex justify-center items-center'>
      <div className='rounded-md max-w-full sm:max-w-[380px] w-full px-4 py-8 flex flex-col items-center justify-center bg-white shadow-xl m-4'>
        <h1 className='text-md font-bold tracking-wide'>Upload your image</h1>
        <h2 className='text-xs tracking-tight my-4'>File should be Jpeg, Png.</h2>

        <form className='flex flex-col justify-center items-center' encType="multipart/form-data" method="post" onSubmit={handleUpload}>

          {

            image === null ?
              <label ref={drop} htmlFor="file" draggable className='border-dashed border-2 border-sky-500 h-52 w-60 sm:w-80 rounded-xl my-4 flex flex-col justify-center items-center bg-gray-100 cursor-pointer'>
                <img id="myImage" className='object-contain w-40 h-20' src="/image.svg" alt="" />
                <p className='text-xs mt-8'>Drag & Drop your image here</p>
              </label>
              :
              <div className='border-dashed border-2 border-sky-500 h-52 w-full sm:w-80 rounded-xl my-4 flex flex-col justify-center items-center bg-gray-100 cursor-pointer overflow-hidden'>
                <img className='w-full h-full object-cover' src={image} alt="" />
              </div>

          }

          <div className='p-4'>
            {
              image === null ? <p className='text-xs'>Or</p> : <p className='text-xs'>Click the below button to upload now!</p>
            }

          </div>

          {
            image === null ? <label htmlFor="file" className='w-28 h-8 bg-blue-500 text-white text-xs px-2 py-1 rounded-md flex justify-center items-center'>Choose a file</label> :
              <button className='w-28 h-8 bg-blue-500 text-white text-xs px-2 py-1 rounded-md flex justify-center items-center' type='submit'>Upload</button>
          }


          <input className='hidden' type="file" name='upload' onChange={handleChange} multiple id="file" />
        </form>
      </div>
    </div>
  )
}

export default App
