
import * as CONSTANT from '../../../../constant/constant'
export const fetchData=async()=>{
  let data
await CONSTANT.API.get('/allarticle').then(response=>{
  data=response.data.data

}).catch(error=>console.log("Error: ",console.log(error)))


return data
}


// export default [
//   {
//     key: "1",
//     profile_picture:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEyuGLk_KjqFoCq1X7PAJZac_GDSktv6GHLBu9gTT8bkMlo5o6d0eTpaEPxp6qaT3ncw8&usqp=CAU",
//     owner: "Zafar Rizvi",
//     image:
//       "https://www.cancer.org/content/dam/cancer-org/images/photographs/single-use/espresso-coffee-cup-with-beans-on-table-restricted.jpg",
//     caption: "A Nice Cup of Coffee is good to start your day <3",
//     likes_count: 12133,
//     timestamp: "05:21 PM",
//   },
//   {
//     key: "2",
//     profile_picture:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEyuGLk_KjqFoCq1X7PAJZac_GDSktv6GHLBu9gTT8bkMlo5o6d0eTpaEPxp6qaT3ncw8&usqp=CAU",
//     owner: "Tanzeel",

//     image:
//       "https://images.theconversation.com/files/254131/original/file-20190116-163274-1u0u5re.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=600&h=400&fit=crop&dpr=1",
//     caption: "Grapes are my favorite fruit",
//     likes_count: 104,
//     timestamp: "05:51 PM",
//   },
//   {
//     key: "3",
//     profile_picture:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEyuGLk_KjqFoCq1X7PAJZac_GDSktv6GHLBu9gTT8bkMlo5o6d0eTpaEPxp6qaT3ncw8&usqp=CAU",
//     owner: "Junaid",
//     image:
//       "https://images.theconversation.com/files/254546/original/file-20190118-100267-chbbjx.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=600&h=485&fit=crop&dpr=1",
//     caption: "Leaf rust (Hemileia vastatrix) on a coffee plant",
//     likes_count: 104,
//     timestamp: "10:51 PM",
//   },
//   {
//     key: "4",
//     profile_picture:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEyuGLk_KjqFoCq1X7PAJZac_GDSktv6GHLBu9gTT8bkMlo5o6d0eTpaEPxp6qaT3ncw8&usqp=CAU",
//     owner: "Junaid",
//     image:
//       "https://images.theconversation.com/files/254324/original/file-20190117-32825-1ys2vrf.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=600&h=399&fit=crop&dpr=1",
//     caption: "Hello",
//     likes_count: 11322,
//     timestamp: "05:51 AM",
//   },
// ];
