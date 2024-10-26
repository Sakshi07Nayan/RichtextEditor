import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch } from 'react-redux';
import { createContent } from '../../store/actions/contentAction';

const NewFeed = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: '',
    tags: '',
    status: 'draft'
  });

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag);

    const contentData = {
      ...formData,
      tags: tagsArray
    };

    dispatch(createContent(contentData));
    setFormData({
      title: '',
      content: '',
      description: '',
      tags: '',
      status: 'draft'
    });
    console.log('formData',contentData);
    
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="bg-light p-5 rounded shadow">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Content</label>
          <ReactQuill
            value={formData.content}
            onChange={handleEditorChange}
            modules={modules}
            className="form-control h-auto"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
        >
          Create Post
        </button>
      </form>
    </div>
  );
};

export default NewFeed;
