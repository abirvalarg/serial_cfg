from flask import Flask, render_template, request, make_response
import json
import struct

app = Flask(__name__)
scheme = None
interface = None

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/send', methods=['POST'])
def send_params():
	try:
		name = request.form['name']
		value = int(request.form['value'])
	except:
		return make_response('Bad data', 400)
	if scheme is None:
		return make_response('Scheme is not set', 400)
	elif interface is None:
		return make_response('Interface is not open', 400)
	code = scheme[name]
	checksum = code
	for i in range(4):
		checksum += (value >> (i * 8)) & 0xff
	try:
		interface.write(struct.pack('<BIB', code, value, checksum & 0xff))
		interface.flush()
	except OSError:
		return make_response('File was closed', 500)
	return ''

@app.route('/scheme', methods=['POST'])
def set_scheme():
	schemeFile = request.files.get('scheme')
	if schemeFile is None:
		return make_response('file is not loaded', 400)
	try:
		sch = json.load(schemeFile)
	except json.JSONDecodeError:
		return make_response('can\'t parse JSON', 400)
	global scheme
	scheme = {}
	try:
		for field in sch:
			scheme[field['name']] = field['code']
	except KeyError:
		return make_response('bad scheme', 400)
	return {'fields': list(scheme.keys())}

@app.route('/open', methods=['POST'])
def open_interface():
	global interface
	path = request.form['path']
	try:
		interface = open(path, 'wb')
	except:
		return make_response('', 400)
	return ''

if __name__ == '__main__':
	app.run('127.0.0.1', 8084, True)
