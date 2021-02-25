pragma solidity 0.5.16;
contract Intruder {
	string public name = "Intruder Token";
	string public symbol = "IGX";
	string public standard = "Intruder Token v1.0";
	uint256 public totalSupply;

	event Transfer (
		address indexed _from,
		address indexed _to,
		uint256 _value
		);

	mapping(address => uint256) public balanceOf;
	constructor(uint256 _initialSupply) public {
		balanceOf[msg.sender]= _initialSupply;
		totalSupply = _initialSupply;
	}

	//Transfer
	function transfer(address _to,uint256 _value) public returns(bool success) {
		//Exception if account doesn't have enough tokens
		require(balanceOf[msg.sender] >= _value);
		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;
		emit Transfer(msg.sender, _to, _value);
		return true;
	}
}