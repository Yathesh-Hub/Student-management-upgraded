// Validation middleware
exports.validateStudentInput = (req, res, next) => {
    const { studentId, fullName, gender, dateOfBirth, department, course, year, 
            mobileNumber, email, addressLine1, city, state, pincode, 
            fatherName, motherName, parentMobile, admissionDate } = req.body;

    const errors = [];

    // Required fields validation
    if (!studentId || studentId.trim() === '') errors.push('Student ID is required');
    if (!fullName || fullName.trim() === '') errors.push('Full name is required');
    if (!gender) errors.push('Gender is required');
    if (!dateOfBirth) errors.push('Date of birth is required');
    if (!department) errors.push('Department is required');
    if (!course) errors.push('Course is required');
    if (!year) errors.push('Year is required');
    if (!mobileNumber) errors.push('Mobile number is required');
    if (!email) errors.push('Email is required');
    if (!addressLine1 || addressLine1.trim() === '') errors.push('Address is required');
    if (!city || city.trim() === '') errors.push('City is required');
    if (!state || state.trim() === '') errors.push('State is required');
    if (!pincode) errors.push('Pincode is required');
    if (!fatherName || fatherName.trim() === '') errors.push('Father name is required');
    if (!motherName || motherName.trim() === '') errors.push('Mother name is required');
    if (!parentMobile) errors.push('Parent mobile number is required');
    if (!admissionDate) errors.push('Admission date is required');

    // Format validation
    if (mobileNumber && !/^[0-9]{10}$/.test(mobileNumber)) {
        errors.push('Mobile number must be 10 digits');
    }

    if (email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        errors.push('Invalid email format');
    }

    if (pincode && !/^[0-9]{6}$/.test(pincode)) {
        errors.push('Pincode must be 6 digits');
    }

    if (parentMobile && !/^[0-9]{10}$/.test(parentMobile)) {
        errors.push('Parent mobile number must be 10 digits');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};

exports.validateUserRegistration = (req, res, next) => {
    const { name, email, password } = req.body;
    const errors = [];

    if (!name || name.trim() === '') errors.push('Name is required');
    if (!email || email.trim() === '') errors.push('Email is required');
    if (!password) errors.push('Password is required');

    if (email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        errors.push('Invalid email format');
    }

    if (password && password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};

exports.validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email || email.trim() === '') errors.push('Email is required');
    if (!password) errors.push('Password is required');

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};
