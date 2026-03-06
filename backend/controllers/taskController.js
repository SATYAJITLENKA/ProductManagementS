import Task from "../models/Task.js";



export const createTask = async (req, res) => {

  try {

    const { title, status, priority, project } = req.body;

    const task = await Task.create({
      title,
      status,
      priority,
      project
    });

    res.status(201).json(task);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};





export const getTasks = async (req, res) => {

  try {

    const { projectId } = req.query;

    const tasks = await Task.find({ project: projectId });

    res.json(tasks);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};





export const updateTask = async (req, res) => {

  try {

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(task);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};





export const deleteTask = async (req, res) => {

  try {

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: "Task deleted"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};