import React from 'react';

function TaskForm(props) {
  const {
    title, titleEl, description, descriptionEl, date, dateEl, category, categoryEl,
  } = props;
  return (
    <form>
      <div className="form-control">
        <label htmlFor='title'>Title</label>
        <input ref={titleEl} id='title' name='title' type='text' placeholder='Enter title' 
          defaultValue={title ? title : ''}
        />
      </div>
      <div className="form-control">
        <label htmlFor='description'>Description</label>
        <textarea ref={descriptionEl} id='description' rows={4} placeholder='Enter desciption' 
          defaultValue={description ? description : ''}
        />
      </div>
      <div className="form-control">
        <label htmlFor='date'>Date</label>
        <input ref={dateEl} id='date' name='date' type='datetime-local' placeholder='Enter date' 
          defaultValue={date ? date : ''}
        />
      </div>
      <div className="form-control">
        <label htmlFor='category'>Category</label>
        <input ref={categoryEl} id='category' name='category' type='text' placeholder='Enter category' 
          defaultValue={category ? category : ''}
        />
      </div>
    </form>
  );
}

export default TaskForm;