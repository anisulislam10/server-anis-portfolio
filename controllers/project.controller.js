import Project from '../models/project.models.js';

export const createProject = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      technologies,
      githubUrl,
      liveDemoUrl,
      featured
    } = req.body;

    const techArray = Array.isArray(technologies)
      ? technologies
      : [technologies].filter(Boolean);

    const project = new Project({
      title,
      subtitle,
      description,
      technologies: techArray,
      githubUrl,
      liveDemoUrl,
      featured,
      projectImage: req.file ? req.file.filename : undefined, // Add this line
      createdAt: new Date()
    });

    await project.save();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });

  } catch (err) {
    console.error("Error creating project:", err);

    let errorMessage = 'Internal server error';
    let statusCode = 500;

    if (err.name === 'ValidationError') {
      statusCode = 400;
      errorMessage = Object.values(err.errors)
        .map(val => val.message)
        .join(', ');
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
};


export const getAllProjects = async (req, res) => {
  try {
    // Extract query parameters
    const { featured, sort, fields, limit, page } = req.query;
    
    // Create base query
    const query = {};
    
    // Filter by featured status if provided
    if (featured) {
      query.featured = featured === 'true';
    }
    
    // Execute query with chaining
    let result = Project.find(query);
    
    // Apply sorting
    if (sort) {
      const sortList = sort.split(',').join(' ');
      result = result.sort(sortList);
    } else {
      // Default sorting by newest first
      result = result.sort('createdAt');
    }
    
    // Field limiting
    if (fields) {
      const fieldsList = fields.split(',').join(' ');
      result = result.select(fieldsList);
    }
    
    // Pagination
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;
    
    result = result.skip(skip).limit(pageSize);
    
    // Execute final query
    const projects = await result;
    
    // Get total count for pagination info
    const total = await Project.countDocuments(query);
    
    res.status(200).json({ 
      success: true,
      count: projects.length,
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
      data: projects 
    });
    
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to retrieve projects',
    });
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
    const { id } = req.params;
    const { 
      title, 
      subtitle, 
      description, 
      technologies, 
      githubUrl, 
      liveDemoUrl, 
      featured 
    } = req.body;

    // Validate project exists
    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Prepare update data
    const updateData = {
      title: title || existingProject.title,
      subtitle: subtitle || existingProject.subtitle,
      description: description || existingProject.description,
      technologies: Array.isArray(technologies) 
        ? technologies 
        : technologies?.split(',') || existingProject.technologies,
      githubUrl: githubUrl || existingProject.githubUrl,
      liveDemoUrl: liveDemoUrl || existingProject.liveDemoUrl,
      featured: featured !== undefined ? featured : existingProject.featured,
      updatedAt: new Date()
    };

    // Add image if uploaded
    if (req.file) {
      updateData.projectImage = req.file.filename;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
        context: 'query'
      }
    );

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });

  } catch (err) {
    console.error('Update project error:', err);
    let statusCode = 500;
    let errorMessage = 'Failed to update project';

    if (err.name === 'ValidationError') {
      statusCode = 400;
      errorMessage = Object.values(err.errors)
        .map(error => error.message)
        .join(', ');
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
};
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if project exists
    const project = await Project.findByIdAndDelete(id);
    
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Project deleted successfully',
      deletedProject: {
        id: project._id,
        title: project.title
      }
    });

  } catch (err) {
    console.error('Delete project error:', err);
    
    // Handle specific error cases
    let statusCode = 500;
    let errorMessage = 'Failed to delete project';

    if (err.name === 'CastError') {
      statusCode = 400;
      errorMessage = 'Invalid project ID format';
    }

    res.status(statusCode).json({ 
      success: false,
      message: errorMessage,
    });
  }
};