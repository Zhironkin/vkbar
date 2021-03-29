import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPosts, sorting, getRequest } from '../slices/postsSlice';

const SortingPosts = () => {
   const dispatch = useDispatch()
   const { sort_by, select_sort, sort_asc } = useSelector(selectPosts)

   const checkDir = item => item === select_sort ? true : false

   const handleClick = data => {
      dispatch(getRequest(true))
      dispatch(sorting(data))
   }

   return (
      <div className="vk-bar-sorting">
         <span 
            className={checkDir(sort_by.likes) ? "active" : ''} 
            onClick={() => handleClick({sort: sort_by.likes, dir: !sort_asc})}
         >
            Лайки
         </span>
         <span 
            className={checkDir(sort_by.reposts) ? "active" : ''} 
            onClick={() => handleClick({sort: sort_by.reposts, dir: !sort_asc})}
         >
            Репосты
         </span>
         <span 
            className={checkDir(sort_by.comments) ? "active" : ''} 
            onClick={() => handleClick({sort: sort_by.comments, dir: !sort_asc})}
         >
            Комментарии
         </span>
         <span 
            className={checkDir(sort_by.date) ? "active" : ''}
            onClick={() => handleClick({sort: sort_by.date, dir: !sort_asc})}
         >
            Дата
         </span>
      </div>
   )
}

export default SortingPosts;