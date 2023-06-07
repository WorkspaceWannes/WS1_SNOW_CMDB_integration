(function process( /*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {


    this.status = '200';
    var respObj = {}; //declare the response object
    var payload = request.body.data;  //retrieving the JSON body
    var serial_number = payload.serial_number;  //getting the serialnumber from JSON
    var cpu_core_count = payload.cpu_core_count;
    var cpu_count = payload.cpu_count;
	var cpu_speed = payload.cpu_speed;
	var cpu_type = payload.cpu_type;
	var cpu_name = payload.cpu_name;
	var chassis_type = payload.chassis_type;


    var gr = new GlideRecord("cmdb_ci_computer");
    gr.addQuery('serial_number','=',serial_number);
    gr.query();
    if (gr.next()) { // To update data on the existing incidents

        gr.serial_number = serial_number;
        gr.cpu_core_count = cpu_core_count;
        gr.cpu_count = cpu_count;
		gr.cpu_speed = cpu_speed;
		gr.cpu_type = cpu_type;
		gr.cpu_name = cpu_name;
		gr.chassis_type = chassis_type;
		
        gr.update();
		
        this.status = '200';
        respObj.body = {
            "message": "Update Successful!",
            "detail": "device " + gr.serial_number + " updated successfully"
        };
    } 
	//uncomment the section below if you want to create new records, next to update existing ones (requires POST instead of PATCH)
	/* else if (serial_number) { //create computer object if serial_number is not empty

        gr.initialize();
        gr.serial_number = serial_number;
        gr.cpu_core_count = cpu_core_count;
        gr.cpu_count = cpu_count;
		gr.cpu_speed = cpu_speed;
		gr.cpu_type = cpu_type;
		gr.cpu_name = cpu_name;
		gr.chassis_type = chassis_type;
		
        gr.insert();

        this.status = '200';
        respObj.body = {
            "message": "Creation Success!",
            "detail": "Computer " + gr.serial_number + " created successfully"
        };

    }*/ 
	else { //ignore the request if there is no serial_number
        this.status = '400';
        respObj.body = {
            "message": "Request Ignored, serial number is missing",
            "detail": "Serial number is missing in the Request"
        };

    }

    if (this.status == '200') {
        response.setBody(respObj);
        response.setStatus(this.status);
        return response;
    } else {
        var setError= new sn_ws_err.ServiceError();  //this API used to set the custom error messages
        setError.setStatus(this.status);
        setError.setMessage(respObj.body.message);
        setError.setDetail(respObj.body.detail);
        return setError;
    }

})(request, response);