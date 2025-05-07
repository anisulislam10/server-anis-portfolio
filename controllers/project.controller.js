import Project from '../models/project.models.js';
import cloudinary from '../utils/cloudinary.utils.js';

export const createProject = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Image is required' });
    }

    // Upload buffer directly to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      // Write the buffer to the upload stream
      uploadStream.end(req.file.buffer);
    });

    const project = new Project({
      ...req.body,
      technologies: req.body.technologies?.split(','),
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id
    });

    await project.save();
    res.status(201).json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getAllProjects = async (_req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(200).json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    let updatedData = {
      ...req.body,
      technologies: req.body.technologies?.split(',')
    };

    if (req.file) {
      // First delete old image from Cloudinary if it exists
      if (project.cloudinaryId) {
        await cloudinary.uploader.destroy(project.cloudinaryId);
      }

      // Upload new image
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      updatedData.imageUrl = result.secure_url;
      updatedData.cloudinaryId = result.public_id;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.status(200).json({ success: true, project: updatedProject });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Delete image from Cloudinary if it exists
    if (project.cloudinaryId) {
      await cloudinary.uploader.destroy(project.cloudinaryId);
    }

    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};