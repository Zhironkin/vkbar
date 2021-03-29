import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPosts, getPosts, Auth } from '../slices/postsSlice';
import SearchGroups from './search-groups';
import Posts from './posts';
import SortingPosts from './sorting-posts';
import Loader from './loader';

const Home = () => {

   const dispatch = useDispatch()
   const { posts, members_count, selectGroup, group, error, loading, user } = useSelector(selectPosts)

   console.log('user', user);
   useEffect(() => {
      // const status = localStorage.getItem('status')
      // if (!status && status !== 'connected') {
         dispatch(Auth())
      // }
   }, [])

   useEffect(() => {
      if (selectGroup) {
         dispatch(getPosts(selectGroup))
      }
   }, [dispatch, selectGroup])

   const VkBar = () => (
      <div>
         <div className="vk-bar-header">
            <div className="vk-bar-group">
               <div><img src={group.photo} /></div>
               <div>{group.name}</div>
            </div>

            <SortingPosts />
         </div>

         <div className="vk-bar-body">
            <Posts posts={posts} members_count={members_count} />
         </div>
      </div>
   )
   

   if (error) return <div>{error}</div>
   
   return (
      <div className="vk-bar">
         {user.first_name && <div>Привет, {user.first_name}</div>}
         <SearchGroups />
         {loading && <Loader />}
         {!loading && selectGroup != 0 && <VkBar />}
      </div>
   )
}

export default Home;