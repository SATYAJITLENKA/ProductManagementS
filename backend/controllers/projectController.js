import Project from "../models/Project.js";
import Task from "../models/Task.js";


export const createProject = async (req, res) => {

  try {

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = await Project.create({
      name,
      user: req.userId
    });

    res.status(201).json(project);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



// GET ALL PROJECTS

export const getProjects = async (req, res) => {

  try {

    const projects = await Project.find({ user: req.userId });

    const projectsWithTaskCount = await Promise.all(
      projects.map(async (project) => {
        const taskCount = await Task.countDocuments({ project: project._id });
        return {
          ...project.toObject(),
          taskCount
        };
      })
    );

    res.json(projectsWithTaskCount);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



export const getProject = async (req, res) => {

  try {

    const project = await Project.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const taskCount = await Task.countDocuments({ project: project._id });

    res.json({
      ...project.toObject(),
      taskCount
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};