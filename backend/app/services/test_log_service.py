from app.repositories import test_log_repository


def add_test_log(log):
    test_log_repository.add_test_log(log)


def get_test_logs():
    return test_log_repository.get_all_test_logs()

def get_response_time_history(name: str):
    return test_log_repository.get_response_time_history(name)

def get_status_history(name: str):
    return test_log_repository.get_status_history(name)