import axios from "axios";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  
  const navigate=useNavigate();

  const [products,setProducts]=useState([]);


  async function getProducts(){
  
    axios.get("http://localhost:3000/user/products",{
      headers:{
        "Authorization":`Bearer ${localStorage.getItem("token")}`
      }
    }).then((res)=>{
      const data=res.data;
      setProducts(data.products);
    }).catch((err)=>{
      console.log(err);
    })
  }


 useEffect(()=>{
  getProducts();
 },[])



  return (
    <>
    <main className="w-full min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-red-700">Our Products</h1>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" >
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-gray-800 rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform duration-300"
            onClick={()=>{navigate(`/product-details`,{
              state:{
                product
              }
            })}}
          >
            {product.images && product.images.length > 0 && (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-300 mb-3">{product.description}</p>
            <p className="text-lg font-bold text-green-400">Rs{product.price}</p>
          </div>

        ))}
      </div>
    </main>
    </>
    
  );
}

export default Home;



