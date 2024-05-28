import { FC } from "react";

import { AppFormProps } from '../../interfaces/componentsProps/AppForm';

import './appForm.scss';

const AppForm: FC<AppFormProps> = ({ 
  title, 
  setTitle, 
  description, 
  setDescription, 
  submitForm, 
  rejectForm, 
  titleError 
}) => {
  return (
    <form onSubmit={submitForm} className='appForm'>
      <input
        type="text"
        value={title}
        onChange={setTitle}
        className={`appForm__input ${titleError.error ? 'error' : ''}`}
        placeholder={titleError.error ? `*${titleError.placeholder} is required` : titleError.placeholder}
      />

      <textarea
        className='appForm__textarea'
        value={description}
        onChange={setDescription}
        placeholder="Description..."
      />

      <div className='appForm__btns'>
        <button className='appForm__send-form' type='submit'>Confirm</button>
        
        <button className='appForm__reject-form' type='button' onClick={rejectForm}>Cancel</button>
      </div>
    </form>
  );
};

export default AppForm;
