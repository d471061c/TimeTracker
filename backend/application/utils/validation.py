# TODO: validate also json types
def validate_json(content, keywords):
    ''' validate json content '''
    return len(content.keys() & keywords) == len(keywords)