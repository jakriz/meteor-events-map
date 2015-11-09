require 'ipaddr'
require 'faraday'
require 'json'

conn = Faraday.new(url: 'http://localhost:3000')
conn.basic_auth('admin', 'admin')

while (true) do
  ip = IPAddr.new(rand(2**32), Socket::AF_INET)

  conn.post do |req|
    req.url '/events'
    req.headers['Content-Type'] = 'application/json'
    req.body = { ipAddress: ip.to_s }.to_json
  end

  puts "sent event with ip #{ip.to_s}"
  sleep(rand(6)+1)
end
