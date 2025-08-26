import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    title: { type: String },
    subtitle: { type: String },
    description: { type: String },
    technologies: { type: [String] },
    githubUrl: { type: String },
    liveDemoUrl: { type: String },
    featured: { type: Boolean, default: false },
    projectImage: { type: String }
  },
  { timestamps: true }
)

const Project = mongoose.model('Project', projectSchema)
export default Project
