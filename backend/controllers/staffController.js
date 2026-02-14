const Staff = require('../models/Staff');
const Attendance = require('../models/Attendance');

// Get all staff
exports.getAllStaff = async (req, res) => {
  try {
    const { branchId } = req.query;
    let query = {};

    if (branchId) {
      query.branch = branchId;
    } else if (req.session.role === 'Branch Manager') {
      query.branch = req.session.branch._id;
    }

    const staff = await Staff.find(query)
      .populate('branch', 'name')
      .sort({ createdAt: -1 });

    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get staff by ID
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
      .populate('branch', 'name');

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create staff
exports.createStaff = async (req, res) => {
  try {
    const { name, email, phone, role, salary, branch, joinDate } = req.body;

    if (!name || !email || !phone || !role || !salary || !branch) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const staff = new Staff({
      name,
      email,
      phone,
      role,
      salary,
      branch,
      joinDate: joinDate || new Date()
    });

    await staff.save();

    res.status(201).json({
      message: 'Staff created successfully',
      staff: await staff.populate('branch', 'name')
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update staff
exports.updateStaff = async (req, res) => {
  try {
    const { name, email, phone, role, salary, status, joinDate } = req.body;

    let staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    if (name) staff.name = name;
    if (email) staff.email = email;
    if (phone) staff.phone = phone;
    if (role) staff.role = role;
    if (salary) staff.salary = salary;
    if (status) staff.status = status;
    if (joinDate) staff.joinDate = joinDate;

    staff.updatedAt = Date.now();
    await staff.save();

    res.json({
      message: 'Staff updated successfully',
      staff: await staff.populate('branch', 'name')
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete staff
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Record attendance
exports.recordAttendance = async (req, res) => {
  try {
    const { staff, branch, date, status, checkInTime, checkOutTime, notes } = req.body;

    if (!staff || !branch || !date || !status) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    let attendance = await Attendance.findOne({
      staff,
      date: { $gte: new Date(date).setHours(0, 0, 0, 0), $lt: new Date(date).setHours(23, 59, 59, 999) }
    });

    if (attendance) {
      attendance.status = status;
      if (checkInTime) attendance.checkInTime = checkInTime;
      if (checkOutTime) attendance.checkOutTime = checkOutTime;
      if (notes) attendance.notes = notes;
    } else {
      attendance = new Attendance({
        staff,
        branch,
        date,
        status,
        checkInTime,
        checkOutTime,
        notes
      });
    }

    await attendance.save();

    res.status(201).json({
      message: 'Attendance recorded successfully',
      attendance: await attendance.populate([
        { path: 'staff', select: 'name' },
        { path: 'branch', select: 'name' }
      ])
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance records
exports.getAttendance = async (req, res) => {
  try {
    const { branchId, staffId, startDate, endDate } = req.query;
    let query = {};

    if (branchId) {
      query.branch = branchId;
    }

    if (staffId) {
      query.staff = staffId;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .populate('staff', 'name')
      .populate('branch', 'name')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
