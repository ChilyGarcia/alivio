export interface Appointments {
    appointment: Appointment;
}

export interface Appointment {
    health_professional_id: number;
    date:                   Date;
    start_time:             string;
    end_time:               string;
    patient_id:             number;
    status:                 string;
    updated_at:             Date;
    created_at:             Date;
    id:                     number;
}
