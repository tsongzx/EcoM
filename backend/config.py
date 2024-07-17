class Config(object):
    # NOTE: MOVE THIS TO CONFIG FILE!?!??!
    # to get a string like this run:
    # openssl rand -hex 32
    SECRET_KEY = "45aa99285e9155a8b8792a3075c62fbdba8f71a9d921a12bcb8a6e0105f73e5a"
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
