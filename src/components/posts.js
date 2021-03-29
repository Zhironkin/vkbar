import React from 'react';
import { GridList, GridListTile } from '@material-ui/core';
import { FavoriteBorder as LikeIcon, ChatBubbleOutline as CommentsIcon,
  Repeat as ReplyIcon } from '@material-ui/icons';

const Posts = ({ posts, members_count }) => {
   
   const custom_attach = data => (data || []).map((item, index) => {
      if (index >= 9) return null

      let { photo, type } = item

      if ( type === 'photo' ) {
         return (
            <GridListTile key={photo.id} cols={1}>
               <img src={photo.photo_604} />
            </GridListTile>
         )
      }
   })

   const dateFormat = item => item.toString().length === 1 ? `0${item}` : item

   const ERpost = item => {
      let totalReaction = item.likes.count + item.reposts.count + item.comments.count + (item.views ? item.views.count : 0)
      let ER = (totalReaction / members_count) * 100

      return 'ERpost ' + ER.toFixed(2) + '%'
   }

   const textFormat = text => text.split("\n").map((item, key) => (<div key={key.toString()}>{item}</div>))

   const renderPosts = () => (posts || []).map(item => {
      let date = new Date(item.date * 1000)

      let photo_length = item.attachments && item.attachments.filter(item => item.type === 'photo').length
      let cols = photo_length && photo_length > 2 ? Math.ceil(photo_length / 3) : 1      

      return (
         <div key={item.id.toString()} className="post">
            <div className="post-header">
               {textFormat(item.text)}
            </div>
            <div className="post-body">
               {item.attachments && 
                  <GridList cellHeight={cols >= 2 ? 180 : 'auto'} className="grid" cols={cols}>
                     {custom_attach(item.attachments)}
                  </GridList>
               }
            </div>
            <div className="post-footer">
               <div className="date">
                  {dateFormat(date.getDate())}.{dateFormat(date.getMonth() + 1)}.{date.getFullYear()}
                  {' / '}
                  {dateFormat(date.getHours())}:{dateFormat(date.getMinutes())}
               </div>
               <div>{ERpost(item)}</div>
               <div className="likes"><LikeIcon /> {item.likes.count > 0 && item.likes.count}</div>
               <div className="reposts"><ReplyIcon /> {item.reposts.count > 0 && item.reposts.count}</div>
               <div className="comments"><CommentsIcon /> {item.comments.count > 0 && item.comments.count}</div>
            </div>
         </div>
      )
   })

   return (
      <div className="posts">
         {renderPosts()}
      </div>
   )
}

export default Posts;