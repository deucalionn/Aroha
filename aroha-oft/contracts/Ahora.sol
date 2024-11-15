// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Ahora is Ownable {
    bytes32 public merkleRoot;

    mapping(address => bool) private isWhitelisted;

    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
    }

    function whitelistAddress(bytes32 _root, bytes32 _leaf) public pure {
        MerkleProof.verify(_root, _leaf, 0);
    }

    function isWhitelisted(address _account, bytes32[] calldata _proof) internal view returns(bool) {
        bytes32 leaf = keccak256(abi.encode(keccak256(abi.encode(_account))));
        return MerkleProof.verify(_proof, merkleRoot, leaf);
    }

}