import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function Man({ gesture = 0 }) {
  const rightArm = useRef()
  const leftArm = useRef()
  const head = useRef()

  const rightHand = useRef()
  const leftHand = useRef()

  const targetRight = useRef(new THREE.Euler(0, 0, 0))
  const targetLeft = useRef(new THREE.Euler(0, 0, 0))

  useEffect(() => {
    // Gesture 2: Pointing
    if (gesture === 2) {
      targetRight.current.set(-0.8, 0, -1.0)
      targetLeft.current.set(0, 0, 0.2)
    }

    // Gesture 3: Explaining
    else if (gesture === 3) {
      targetRight.current.set(-1.0, 0, -0.7)
      targetLeft.current.set(-1.0, 0, 0.7)
    }

    // Default: Idle
    else {
      targetRight.current.set(0, 0, -0.12)
      targetLeft.current.set(0, 0, 0.12)
    }
  }, [gesture])

  useFrame((state, delta) => {
    const speed = Math.min(delta * 5, 1)

    if (rightArm.current) {
      rightArm.current.rotation.x = THREE.MathUtils.lerp(
        rightArm.current.rotation.x,
        targetRight.current.x,
        speed
      )

      rightArm.current.rotation.z = THREE.MathUtils.lerp(
        rightArm.current.rotation.z,
        targetRight.current.z,
        speed
      )
    }

    if (leftArm.current) {
      leftArm.current.rotation.x = THREE.MathUtils.lerp(
        leftArm.current.rotation.x,
        targetLeft.current.x,
        speed
      )

      leftArm.current.rotation.z = THREE.MathUtils.lerp(
        leftArm.current.rotation.z,
        targetLeft.current.z,
        speed
      )
    }

    if (head.current) {
      head.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.8) * 0.05
    }

    if (gesture === 3) {
      const movement = Math.sin(state.clock.elapsedTime * 3) * 0.15

      if (rightArm.current) {
        rightArm.current.rotation.x =
          targetRight.current.x + movement
      }

      if (leftArm.current) {
        leftArm.current.rotation.x =
          targetLeft.current.x - movement
      }
    }
  })

  return (
    <group position={[0, -1.1, 0]}>
      {/* Legs */}
      <mesh position={[-0.22, 0.35, 0]} castShadow>
        <capsuleGeometry args={[0.13, 0.65, 6, 12]} />
        <meshStandardMaterial color="#263b63" />
      </mesh>

      <mesh position={[0.22, 0.35, 0]} castShadow>
        <capsuleGeometry args={[0.13, 0.65, 6, 12]} />
        <meshStandardMaterial color="#263b63" />
      </mesh>

      {/* Shoes */}
      <mesh position={[-0.22, -0.08, 0.1]}>
        <boxGeometry args={[0.25, 0.13, 0.4]} />
        <meshStandardMaterial color="#20242c" />
      </mesh>

      <mesh position={[0.22, -0.08, 0.1]}>
        <boxGeometry args={[0.25, 0.13, 0.4]} />
        <meshStandardMaterial color="#20242c" />
      </mesh>

      {/* Body */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <capsuleGeometry args={[0.32, 0.65, 8, 16]} />
        <meshStandardMaterial color="#3478db" />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.78, 0]}>
        <cylinderGeometry args={[0.11, 0.12, 0.2, 16]} />
        <meshStandardMaterial color="#bd805e" />
      </mesh>

      {/* Head */}
      <group ref={head} position={[0, 2.05, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.31, 32, 32]} />
          <meshStandardMaterial color="#d9a17d" />
        </mesh>

        {/* Hair */}
        <mesh position={[0, 0.17, -0.015]}>
          <sphereGeometry
            args={[0.305, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.52]}
          />
          <meshStandardMaterial color="#30231f" />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.105, 0.02, 0.275]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#201914" />
        </mesh>

        <mesh position={[0.105, 0.02, 0.275]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#201914" />
        </mesh>
      </group>

      {/* Right arm */}
      <group ref={rightArm} position={[0.34, 1.48, 0]}>
        <mesh position={[0.23, -0.2, 0]} rotation={[0, 0, -0.15]}>
          <capsuleGeometry args={[0.105, 0.43, 6, 12]} />
          <meshStandardMaterial color="#3478db" />
        </mesh>

        <mesh ref={rightHand} position={[0.34, -0.46, 0]}>
          <sphereGeometry args={[0.105, 16, 16]} />
          <meshStandardMaterial color="#d9a17d" />
        </mesh>

        {/* Pointing finger */}
        <mesh
          position={[0.46, -0.45, 0.015]}
          rotation={[0, 0, -0.5]}
        >
          <capsuleGeometry args={[0.035, 0.22, 4, 8]} />
          <meshStandardMaterial color="#d9a17d" />
        </mesh>
      </group>

      {/* Left arm */}
      <group ref={leftArm} position={[-0.34, 1.48, 0]}>
        <mesh position={[-0.23, -0.2, 0]}>
          <capsuleGeometry args={[0.105, 0.43, 6, 12]} />
          <meshStandardMaterial color="#3478db" />
        </mesh>

        <mesh ref={leftHand} position={[-0.34, -0.46, 0]}>
          <sphereGeometry args={[0.105, 16, 16]} />
          <meshStandardMaterial color="#d9a17d" />
        </mesh>
      </group>
    </group>
  )
}

export default function AnimatedAvatar({ gesture = 0 }) {
  return (
    <div
      style={{
        width: '100%',
        height: '380px',
        background: 'linear-gradient(180deg, #edf5ff, #ffffff)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      <Canvas
        camera={{ position: [0, 1.3, 5.5], fov: 40 }}
        shadows
      >
        <ambientLight intensity={1.2} />
        <directionalLight
          position={[3, 5, 4]}
          intensity={2}
          castShadow
        />

        <Man gesture={gesture} />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          target={[0, 1, 0]}
        />
      </Canvas>
    </div>
  )
}