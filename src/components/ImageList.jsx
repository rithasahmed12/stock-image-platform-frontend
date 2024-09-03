import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Modal, Upload, Input, message } from "antd";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import {
  getImages,
  uploadImages,
  updateImages,
  deleteImages,
  // updateImagesOrder,
} from "../api/api";
import { useSelector } from "react-redux";

const { Dragger } = Upload;

const ImageList = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [fullSizeImage, setFullSizeImage] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [editingImage, setEditingImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {userInfo} = useSelector((state)=> state.auth);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const fetchedImages = await getImages(userInfo.user._id);
      console.log("Fetched images:", fetchedImages); // Log fetched images
      // Ensure each image has a unique ID
      const imagesWithIds = fetchedImages.map((img, index) => ({
        ...img,
        id: img._id || `temp-id-${index}` // Use _id if available, otherwise create a temporary ID
      }));
      setImages(imagesWithIds);
    } catch (error) {
      console.error("Error fetching images:", error);
      message.error("Failed to fetch images");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditModalVisible(false);
    setNewImages([]);
    setEditingImage(null);
  };

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      newImages.forEach((image, index) => {
        formData.append(`images`, image.originFileObj);
        formData.append(`titles[${index}]`, image.title || '');
        formData.append(`orders[${index}]`, images.length + index);
        formData.append('id',userInfo.user._id)
      });
  
      await uploadImages(formData);
      message.success(`${newImages.length} image(s) uploaded successfully.`);
      setIsModalVisible(false);
      setNewImages([]);
      fetchImages();
    } catch (error) {
      message.error('Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = async () => {
    setIsEditing(true);
    try {
      const formData = new FormData();
      formData.append("title", editingImage.title);
      if (editingImage.newFile) {
        formData.append("image", editingImage.newFile);
      }

      await updateImages(editingImage._id, formData);
      message.success("Image updated successfully");
      setIsEditModalVisible(false);
      setEditingImage(null);
      fetchImages();
    } catch (error) {
      message.error("Failed to update image");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this image?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "No, keep it",
      onOk: async () => {
        try {
          await deleteImages(id);
          message.success("Image deleted successfully");
          fetchImages();
        } catch (error) {
          message.error("Failed to delete image");
        }
      },
    });
  };

  const onDragEnd = (result) => {
    console.log("Drag ended:", result); // Log drag result
    if (!result.destination) {
      return;
    }

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImages(items);

    // // Update the order in the backend
    // updateImagesOrder(items.map(item => item.id)).catch(error => {
    //   message.error("Failed to update image order");
    //   console.error("Error updating image order:", error);
    // });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Images</h2>
  
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="image-list">
              {(provided) => (
                <div 
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {/* Add new image button */}
                  <div
                    onClick={() => setIsModalVisible(true)}
                    className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200"
                    style={{ height: '300px' }}
                  >
                    <PlusIcon className="h-12 w-12 text-black" />
                  </div>
  
                  {images.map((image, index) => {
                    console.log("Rendering image:", image); // Log each image being rendered
                    return (
                      <Draggable key={image.id} draggableId={image.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`group relative ${snapshot.isDragging ? 'z-50' : ''}`}
                          >
                            <div 
                              className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200"
                              style={{ height: '300px' }}
                            >
                              <img
                                alt={image.title}
                                src={image.imageUrl}
                                className="h-full w-full object-cover object-center group-hover:opacity-75"
                                onClick={() => setFullSizeImage(image.imageUrl)}
                              />
                            </div>
                            <h3 className="mt-4 text-sm text-gray-700">{image.title}</h3>
  
                            {/* Icon buttons */}
                            <div className="absolute top-2 right-2 flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditingImage(image);
                                  setIsEditModalVisible(true);
                                }}
                                className="p-1 bg-black rounded-full shadow hover:bg-gray-800"
                              >
                                <PencilIcon className="h-4 w-4 text-white" />
                              </button>
                              <button
                                onClick={() => handleDelete(image.id)}
                                className="p-1 bg-black rounded-full shadow hover:bg-gray-800"
                              >
                                <TrashIcon className="h-4 w-4 text-white" />
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
  

      {/* Upload Modal */}
      <Modal
        open={isModalVisible}
        title="Upload Images"
        onCancel={handleCancel}
        onOk={handleUpload}
        okText="Upload"
        confirmLoading={isUploading}
        width={800}
        okButtonProps={{ style: { backgroundColor: 'black', borderColor: 'black' } }}
        cancelButtonProps={{ style: { borderColor: 'black', color: 'black' } }}
      >
        <Dragger
          multiple={true}
          beforeUpload={(file) => {
            const isImage = file.type.startsWith("image/");
            if (!isImage) {
              message.error(`${file.name} is not an image file`);
            }
            return isImage || Upload.LIST_IGNORE;
          }}
          onChange={(info) => setNewImages(info.fileList)}
          onDrop={(e) => console.log("Dropped files", e.dataTransfer.files)}
        >
          <p className="ant-upload-drag-icon">
            <PlusOutlined style={{ color: 'black' }} />
          </p>
          <p className="ant-upload-text" style={{ color: 'black' }}>
            Click or drag file to this area to upload
          </p>
        </Dragger>
        <div className="grid grid-cols-2 gap-6 mt-6">
          {newImages.map((image) => (
            <div key={image.uid} className="flex flex-col items-center">
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden">
                {image.originFileObj ? (
                  <img
                    src={URL.createObjectURL(image.originFileObj)}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">Loading preview...</span>
                )}
              </div>
              <Input
                placeholder="Enter image title"
                value={image.title || ""}
                onChange={(e) => {
                  const updatedImages = newImages.map((img) =>
                    img.uid === image.uid
                      ? { ...img, title: e.target.value }
                      : img
                  );
                  setNewImages(updatedImages);
                }}
                className="mt-2 w-full"
                style={{ borderColor: 'black' }}
              />
            </div>
          ))}
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={isEditModalVisible}
        title="Edit Image"
        onCancel={handleCancel}
        onOk={handleEdit}
        okText="Save"
        confirmLoading={isEditing}
        okButtonProps={{ style: { backgroundColor: 'black', borderColor: 'black' } }}
        cancelButtonProps={{ style: { borderColor: 'black', color: 'black' } }}
      >
        {editingImage && (
          <div>
            <Input
              placeholder="Enter image title"
              value={editingImage.title}
              onChange={(e) =>
                setEditingImage({ ...editingImage, title: e.target.value })
              }
              className="mb-4"
              style={{ borderColor: 'black' }}
            />
            <Upload
              beforeUpload={(file) => {
                setEditingImage({ ...editingImage, newFile: file });
                return false;
              }}
            >
              <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                Change Image
              </button>
            </Upload>
          </div>
        )}
      </Modal>

      {/* Full Size Image Modal */}
      <Modal
        open={!!fullSizeImage}
        footer={null}
        onCancel={() => setFullSizeImage(null)}
        width="40%"
        style={{ maxWidth: '1000px' }}
      >
        <div style={{ position: 'relative', width: '100%', paddingBottom: '75%' }}>
          <img 
            src={fullSizeImage} 
            alt="Full size" 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }} 
          />
        </div>
      </Modal>
    </div>
  );
};

export default ImageList;