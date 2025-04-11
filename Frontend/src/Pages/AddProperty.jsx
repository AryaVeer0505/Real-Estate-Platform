import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AddProperty = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    type: '',
    images: [], 
    description: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'images') {
      const selectedFiles = Array.from(files).slice(0, 5); 
      setFormData((prev) => ({
        ...prev,
        images: selectedFiles,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      return Swal.fire('Unauthorized', 'You need to log in first.', 'error');
    }

    const form = new FormData();
    form.append('title', formData.title);
    form.append('location', formData.location);
    form.append('price', formData.price);
    form.append('type', formData.type);
    form.append('description', formData.description);

    formData.images.forEach((image, index) => {
      form.append('images', image); 
    });

    try {
      const res = await fetch('http://localhost:5001/api/properties', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire('Success', 'Property added successfully!', 'success').then(() =>
          navigate('/dashboard/owner')
        );
      } else {
        Swal.fire('Error', data.message || 'Something went wrong!', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Server error. Please try again later.', 'error');
    }
  };

  useEffect(() => {
    let user = null;

    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        user = JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Error parsing user data', error);
      user = null;
    }

    if (!user || user.role !== 'owner') {
      Swal.fire({
        title: 'Access Denied',
        text: 'Only property owners can add listings.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Login as Owner',
        cancelButtonText: 'Go Back',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login/owner');
        } else {
          navigate('/');
        }
      });
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 font-sans">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Add New Property</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md space-y-6 border border-gray-200"
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Property Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Cozy Family Home"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Shimla"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Price</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. ₹65,00,000"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Property Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            >
              <option value="">Select type</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="familyhouse">Family House</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Add Images (Max 5)</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Write a short description..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
        >
          Submit Property
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
